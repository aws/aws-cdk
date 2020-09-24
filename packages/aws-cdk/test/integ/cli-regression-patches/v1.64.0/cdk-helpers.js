"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomString = exports.rimraf = exports.shell = exports.TestFixture = exports.cloneDirectory = exports.withDefaultFixture = exports.withCdkApp = exports.withAws = void 0;
const child_process = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");
const aws_helpers_1 = require("./aws-helpers");
const resource_pool_1 = require("./resource-pool");
const REGIONS = process.env.AWS_REGIONS
    ? process.env.AWS_REGIONS.split(',')
    : [(_b = (_a = process.env.AWS_REGION) !== null && _a !== void 0 ? _a : process.env.AWS_DEFAULT_REGION) !== null && _b !== void 0 ? _b : 'us-east-1'];
process.stdout.write(`Using regions: ${REGIONS}\n`);
const REGION_POOL = new resource_pool_1.ResourcePool(REGIONS);
/**
 * Higher order function to execute a block with an AWS client setup
 *
 * Allocate the next region from the REGION pool and dispose it afterwards.
 */
function withAws(block) {
    return (context) => REGION_POOL.using(async (region) => {
        const aws = await aws_helpers_1.AwsClients.forRegion(region, context.output);
        await sanityCheck(aws);
        return block({ ...context, aws });
    });
}
exports.withAws = withAws;
/**
 * Higher order function to execute a block with a CDK app fixture
 *
 * Requires an AWS client to be passed in.
 *
 * For backwards compatibility with existing tests (so we don't have to change
 * too much) the inner block is expecte to take a `TestFixture` object.
 */
function withCdkApp(block) {
    return async (context) => {
        const randy = randomString();
        const stackNamePrefix = `cdktest-${randy}`;
        const integTestDir = path.join(os.tmpdir(), `cdk-integ-${randy}`);
        context.output.write(` Stack prefix:   ${stackNamePrefix}\n`);
        context.output.write(` Test directory: ${integTestDir}\n`);
        context.output.write(` Region:         ${context.aws.region}\n`);
        await cloneDirectory(path.join(__dirname, 'app'), integTestDir, context.output);
        const fixture = new TestFixture(integTestDir, stackNamePrefix, context.output, context.aws);
        let success = true;
        try {
            await fixture.shell(['npm', 'install',
                '@aws-cdk/core',
                '@aws-cdk/aws-sns',
                '@aws-cdk/aws-iam',
                '@aws-cdk/aws-lambda',
                '@aws-cdk/aws-ssm',
                '@aws-cdk/aws-ecr-assets',
                '@aws-cdk/aws-cloudformation',
                '@aws-cdk/aws-ec2']);
            await ensureBootstrapped(fixture);
            await block(fixture);
        }
        catch (e) {
            success = false;
            throw e;
        }
        finally {
            await fixture.dispose(success);
        }
    };
}
exports.withCdkApp = withCdkApp;
/**
 * Default test fixture for most (all?) integ tests
 *
 * It's a composition of withAws/withCdkApp, expecting the test block to take a `TestFixture`
 * object.
 *
 * We could have put `withAws(withCdkApp(fixture => { /... actual test here.../ }))` in every
 * test declaration but centralizing it is going to make it convenient to modify in the future.
 */
function withDefaultFixture(block) {
    return withAws(withCdkApp(block));
    //              ^~~~~~ this is disappointing TypeScript! Feels like you should have been able to derive this.
}
exports.withDefaultFixture = withDefaultFixture;
/**
 * Prepare a target dir byreplicating a source directory
 */
async function cloneDirectory(source, target, output) {
    await shell(['rm', '-rf', target], { output });
    await shell(['mkdir', '-p', target], { output });
    await shell(['cp', '-R', source + '/*', target], { output });
}
exports.cloneDirectory = cloneDirectory;
class TestFixture {
    constructor(integTestDir, stackNamePrefix, output, aws) {
        this.integTestDir = integTestDir;
        this.stackNamePrefix = stackNamePrefix;
        this.output = output;
        this.aws = aws;
        this.qualifier = randomString().substr(0, 10);
        this.bucketsToDelete = new Array();
    }
    log(s) {
        this.output.write(`${s}\n`);
    }
    async shell(command, options = {}) {
        return shell(command, {
            output: this.output,
            cwd: this.integTestDir,
            ...options,
        });
    }
    async cdkDeploy(stackNames, options = {}) {
        var _a, _b;
        stackNames = typeof stackNames === 'string' ? [stackNames] : stackNames;
        const neverRequireApproval = (_a = options.neverRequireApproval) !== null && _a !== void 0 ? _a : true;
        return this.cdk(['deploy',
            ...(neverRequireApproval ? ['--require-approval=never'] : []), // Default to no approval in an unattended test
            ...((_b = options.options) !== null && _b !== void 0 ? _b : []), ...this.fullStackName(stackNames)], options);
    }
    async cdkDestroy(stackNames, options = {}) {
        var _a;
        stackNames = typeof stackNames === 'string' ? [stackNames] : stackNames;
        return this.cdk(['destroy',
            '-f', // We never want a prompt in an unattended test
            ...((_a = options.options) !== null && _a !== void 0 ? _a : []), ...this.fullStackName(stackNames)], options);
    }
    async cdk(args, options = {}) {
        return this.shell(['cdk', '-v', ...args], {
            ...options,
            modEnv: {
                AWS_REGION: this.aws.region,
                AWS_DEFAULT_REGION: this.aws.region,
                STACK_NAME_PREFIX: this.stackNamePrefix,
                ...options.modEnv,
            },
        });
    }
    fullStackName(stackNames) {
        if (typeof stackNames === 'string') {
            return `${this.stackNamePrefix}-${stackNames}`;
        }
        else {
            return stackNames.map(s => `${this.stackNamePrefix}-${s}`);
        }
    }
    /**
     * Append this to the list of buckets to potentially delete
     *
     * At the end of a test, we clean up buckets that may not have gotten destroyed
     * (for whatever reason).
     */
    rememberToDeleteBucket(bucketName) {
        this.bucketsToDelete.push(bucketName);
    }
    /**
     * Cleanup leftover stacks and buckets
     */
    async dispose(success) {
        const stacksToDelete = await this.deleteableStacks(this.stackNamePrefix);
        // Bootstrap stacks have buckets that need to be cleaned
        const bucketNames = stacksToDelete.map(stack => aws_helpers_1.outputFromStack('BucketName', stack)).filter(defined);
        await Promise.all(bucketNames.map(b => this.aws.emptyBucket(b)));
        // Bootstrap stacks have ECR repositories with images which should be deleted
        const imageRepositoryNames = stacksToDelete.map(stack => aws_helpers_1.outputFromStack('ImageRepositoryName', stack)).filter(defined);
        await Promise.all(imageRepositoryNames.map(r => this.aws.deleteImageRepository(r)));
        await this.aws.deleteStacks(...stacksToDelete.map(s => s.StackName));
        // We might have leaked some buckets by upgrading the bootstrap stack. Be
        // sure to clean everything.
        for (const bucket of this.bucketsToDelete) {
            await this.aws.deleteBucket(bucket);
        }
        // If the tests completed successfully, happily delete the fixture
        // (otherwise leave it for humans to inspect)
        if (success) {
            rimraf(this.integTestDir);
        }
    }
    /**
     * Return the stacks starting with our testing prefix that should be deleted
     */
    async deleteableStacks(prefix) {
        var _a;
        const statusFilter = [
            'CREATE_IN_PROGRESS', 'CREATE_FAILED', 'CREATE_COMPLETE',
            'ROLLBACK_IN_PROGRESS', 'ROLLBACK_FAILED', 'ROLLBACK_COMPLETE',
            'DELETE_FAILED',
            'UPDATE_IN_PROGRESS', 'UPDATE_COMPLETE_CLEANUP_IN_PROGRESS',
            'UPDATE_COMPLETE', 'UPDATE_ROLLBACK_IN_PROGRESS',
            'UPDATE_ROLLBACK_FAILED',
            'UPDATE_ROLLBACK_COMPLETE_CLEANUP_IN_PROGRESS',
            'UPDATE_ROLLBACK_COMPLETE', 'REVIEW_IN_PROGRESS',
            'IMPORT_IN_PROGRESS', 'IMPORT_COMPLETE',
            'IMPORT_ROLLBACK_IN_PROGRESS', 'IMPORT_ROLLBACK_FAILED',
            'IMPORT_ROLLBACK_COMPLETE',
        ];
        const response = await this.aws.cloudFormation('describeStacks', {});
        return ((_a = response.Stacks) !== null && _a !== void 0 ? _a : [])
            .filter(s => s.StackName.startsWith(prefix))
            .filter(s => statusFilter.includes(s.StackStatus))
            .filter(s => s.RootId === undefined); // Only delete parent stacks. Nested stacks are deleted in the process
    }
}
exports.TestFixture = TestFixture;
/**
 * Perform a one-time quick sanity check that the AWS clients has properly configured credentials
 *
 * If we don't do this, calls are going to fail and they'll be retried and everything will take
 * forever before the user notices a simple misconfiguration.
 *
 * We can't check for the presence of environment variables since credentials could come from
 * anywhere, so do simple account retrieval.
 *
 * Only do it once per process.
 */
async function sanityCheck(aws) {
    if (sanityChecked === undefined) {
        try {
            await aws.account();
            sanityChecked = true;
        }
        catch (e) {
            sanityChecked = false;
            throw new Error(`AWS credentials probably not configured, got error: ${e.message}`);
        }
    }
    if (!sanityChecked) {
        throw new Error('AWS credentials probably not configured, see previous error');
    }
}
let sanityChecked;
/**
 * Make sure that the given environment is bootstrapped
 *
 * Since we go striping across regions, it's going to suck doing this
 * by hand so let's just mass-automate it.
 */
async function ensureBootstrapped(fixture) {
    // Old-style bootstrap stack with default name
    if (await fixture.aws.stackStatus('CDKToolkit') === undefined) {
        await fixture.cdk(['bootstrap', `aws://${await fixture.aws.account()}/${fixture.aws.region}`]);
    }
}
/**
 * A shell command that does what you want
 *
 * Is platform-aware, handles errors nicely.
 */
async function shell(command, options = {}) {
    var _a, _b;
    if (options.modEnv && options.env) {
        throw new Error('Use either env or modEnv but not both');
    }
    (_a = options.output) === null || _a === void 0 ? void 0 : _a.write(`💻 ${command.join(' ')}\n`);
    const env = (_b = options.env) !== null && _b !== void 0 ? _b : (options.modEnv ? { ...process.env, ...options.modEnv } : undefined);
    const child = child_process.spawn(command[0], command.slice(1), {
        ...options,
        env,
        // Need this for Windows where we want .cmd and .bat to be found as well.
        shell: true,
        stdio: ['ignore', 'pipe', 'pipe'],
    });
    return new Promise((resolve, reject) => {
        const stdout = new Array();
        const stderr = new Array();
        child.stdout.on('data', chunk => {
            var _a;
            (_a = options.output) === null || _a === void 0 ? void 0 : _a.write(chunk);
            stdout.push(chunk);
        });
        child.stderr.on('data', chunk => {
            var _a, _b;
            (_a = options.output) === null || _a === void 0 ? void 0 : _a.write(chunk);
            if ((_b = options.captureStderr) !== null && _b !== void 0 ? _b : true) {
                stderr.push(chunk);
            }
        });
        child.once('error', reject);
        child.once('close', code => {
            if (code === 0 || options.allowErrExit) {
                resolve((Buffer.concat(stdout).toString('utf-8') + Buffer.concat(stderr).toString('utf-8')).trim());
            }
            else {
                reject(new Error(`'${command.join(' ')}' exited with error code ${code}`));
            }
        });
    });
}
exports.shell = shell;
function defined(x) {
    return x !== undefined;
}
/**
 * rm -rf reimplementation, don't want to depend on an NPM package for this
 */
function rimraf(fsPath) {
    try {
        const isDir = fs.lstatSync(fsPath).isDirectory();
        if (isDir) {
            for (const file of fs.readdirSync(fsPath)) {
                rimraf(path.join(fsPath, file));
            }
            fs.rmdirSync(fsPath);
        }
        else {
            fs.unlinkSync(fsPath);
        }
    }
    catch (e) {
        // We will survive ENOENT
        if (e.code !== 'ENOENT') {
            throw e;
        }
    }
}
exports.rimraf = rimraf;
function randomString() {
    // Crazy
    return Math.random().toString(36).replace(/[^a-z0-9]+/g, '');
}
exports.randomString = randomString;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsK0NBQStDO0FBQy9DLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLCtDQUE0RDtBQUM1RCxtREFBK0M7QUFHL0MsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXO0lBQ3JDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxhQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxtQ0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixtQ0FBSSxXQUFXLENBQUMsQ0FBQztBQUU5RSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsT0FBTyxJQUFJLENBQUMsQ0FBQztBQUVwRCxNQUFNLFdBQVcsR0FBRyxJQUFJLDRCQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7QUFLOUM7Ozs7R0FJRztBQUNILFNBQWdCLE9BQU8sQ0FBd0IsS0FBaUQ7SUFDOUYsT0FBTyxDQUFDLE9BQVUsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDeEQsTUFBTSxHQUFHLEdBQUcsTUFBTSx3QkFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9ELE1BQU0sV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXZCLE9BQU8sS0FBSyxDQUFDLEVBQUUsR0FBRyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFQRCwwQkFPQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQixVQUFVLENBQXFDLEtBQThDO0lBQzNHLE9BQU8sS0FBSyxFQUFFLE9BQVUsRUFBRSxFQUFFO1FBQzFCLE1BQU0sS0FBSyxHQUFHLFlBQVksRUFBRSxDQUFDO1FBQzdCLE1BQU0sZUFBZSxHQUFHLFdBQVcsS0FBSyxFQUFFLENBQUM7UUFDM0MsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUUsYUFBYSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRWxFLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixlQUFlLElBQUksQ0FBQyxDQUFDO1FBQzlELE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixZQUFZLElBQUksQ0FBQyxDQUFDO1FBQzNELE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLG9CQUFvQixPQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7UUFFakUsTUFBTSxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLEVBQUUsWUFBWSxFQUFFLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNoRixNQUFNLE9BQU8sR0FBRyxJQUFJLFdBQVcsQ0FDN0IsWUFBWSxFQUNaLGVBQWUsRUFDZixPQUFPLENBQUMsTUFBTSxFQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVmLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJO1lBQ0YsTUFBTSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLFNBQVM7Z0JBQ25DLGVBQWU7Z0JBQ2Ysa0JBQWtCO2dCQUNsQixrQkFBa0I7Z0JBQ2xCLHFCQUFxQjtnQkFDckIsa0JBQWtCO2dCQUNsQix5QkFBeUI7Z0JBQ3pCLDZCQUE2QjtnQkFDN0Isa0JBQWtCLENBQUMsQ0FBQyxDQUFDO1lBRXZCLE1BQU0sa0JBQWtCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFFbEMsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDdEI7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sR0FBRyxLQUFLLENBQUM7WUFDaEIsTUFBTSxDQUFDLENBQUM7U0FDVDtnQkFBUztZQUNSLE1BQU0sT0FBTyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztTQUNoQztJQUNILENBQUMsQ0FBQztBQUNKLENBQUM7QUF2Q0QsZ0NBdUNDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFnQixrQkFBa0IsQ0FBQyxLQUE4QztJQUMvRSxPQUFPLE9BQU8sQ0FBYyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMvQyw2R0FBNkc7QUFDL0csQ0FBQztBQUhELGdEQUdDO0FBaUNEOztHQUVHO0FBQ0ksS0FBSyxVQUFVLGNBQWMsQ0FBQyxNQUFjLEVBQUUsTUFBYyxFQUFFLE1BQThCO0lBQ2pHLE1BQU0sS0FBSyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDL0MsTUFBTSxLQUFLLENBQUMsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztJQUNqRCxNQUFNLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsTUFBTSxHQUFHLElBQUksRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUpELHdDQUlDO0FBRUQsTUFBYSxXQUFXO0lBSXRCLFlBQ2tCLFlBQW9CLEVBQ3BCLGVBQXVCLEVBQ3ZCLE1BQTZCLEVBQzdCLEdBQWU7UUFIZixpQkFBWSxHQUFaLFlBQVksQ0FBUTtRQUNwQixvQkFBZSxHQUFmLGVBQWUsQ0FBUTtRQUN2QixXQUFNLEdBQU4sTUFBTSxDQUF1QjtRQUM3QixRQUFHLEdBQUgsR0FBRyxDQUFZO1FBUGpCLGNBQVMsR0FBRyxZQUFZLEVBQUUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3hDLG9CQUFlLEdBQUcsSUFBSSxLQUFLLEVBQVUsQ0FBQztJQU92RCxDQUFDO0lBRU0sR0FBRyxDQUFDLENBQVM7UUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFTSxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQWlCLEVBQUUsVUFBOEMsRUFBRTtRQUNwRixPQUFPLEtBQUssQ0FBQyxPQUFPLEVBQUU7WUFDcEIsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNO1lBQ25CLEdBQUcsRUFBRSxJQUFJLENBQUMsWUFBWTtZQUN0QixHQUFHLE9BQU87U0FDWCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sS0FBSyxDQUFDLFNBQVMsQ0FBQyxVQUE2QixFQUFFLFVBQXlCLEVBQUU7O1FBQy9FLFVBQVUsR0FBRyxPQUFPLFVBQVUsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUV4RSxNQUFNLG9CQUFvQixTQUFHLE9BQU8sQ0FBQyxvQkFBb0IsbUNBQUksSUFBSSxDQUFDO1FBRWxFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVE7WUFDdkIsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxDQUFDLDBCQUEwQixDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLCtDQUErQztZQUM5RyxHQUFHLE9BQUMsT0FBTyxDQUFDLE9BQU8sbUNBQUksRUFBRSxDQUFDLEVBQzFCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFTSxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQTZCLEVBQUUsVUFBeUIsRUFBRTs7UUFDaEYsVUFBVSxHQUFHLE9BQU8sVUFBVSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBRXhFLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVM7WUFDeEIsSUFBSSxFQUFFLCtDQUErQztZQUNyRCxHQUFHLE9BQUMsT0FBTyxDQUFDLE9BQU8sbUNBQUksRUFBRSxDQUFDLEVBQzFCLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFTSxLQUFLLENBQUMsR0FBRyxDQUFDLElBQWMsRUFBRSxVQUF5QixFQUFFO1FBQzFELE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFO1lBQ2xDLEdBQUcsT0FBTztZQUNWLE1BQU0sRUFBRTtnQkFDTixVQUFVLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNO2dCQUMzQixrQkFBa0IsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU07Z0JBQ25DLGlCQUFpQixFQUFFLElBQUksQ0FBQyxlQUFlO2dCQUN2QyxHQUFHLE9BQU8sQ0FBQyxNQUFNO2FBQ2xCO1NBQ0YsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUlNLGFBQWEsQ0FBQyxVQUE2QjtRQUNoRCxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRTtZQUNsQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGVBQWUsSUFBSSxVQUFVLEVBQUUsQ0FBQztTQUNoRDthQUFNO1lBQ0wsT0FBTyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsZUFBZSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDNUQ7SUFDSCxDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSSxzQkFBc0IsQ0FBQyxVQUFrQjtRQUM5QyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQ7O09BRUc7SUFDSSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQWdCO1FBQ25DLE1BQU0sY0FBYyxHQUFHLE1BQU0sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUV6RSx3REFBd0Q7UUFDeEQsTUFBTSxXQUFXLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLDZCQUFlLENBQUMsWUFBWSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3RHLE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWpFLDZFQUE2RTtRQUM3RSxNQUFNLG9CQUFvQixHQUFHLGNBQWMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyw2QkFBZSxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hILE1BQU0sT0FBTyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVwRixNQUFNLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBRXJFLHlFQUF5RTtRQUN6RSw0QkFBNEI7UUFDNUIsS0FBSyxNQUFNLE1BQU0sSUFBSSxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pDLE1BQU0sSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDckM7UUFFRCxrRUFBa0U7UUFDbEUsNkNBQTZDO1FBQzdDLElBQUksT0FBTyxFQUFFO1lBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFRDs7T0FFRztJQUNLLEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFjOztRQUMzQyxNQUFNLFlBQVksR0FBRztZQUNuQixvQkFBb0IsRUFBRSxlQUFlLEVBQUUsaUJBQWlCO1lBQ3hELHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLG1CQUFtQjtZQUM5RCxlQUFlO1lBQ2Ysb0JBQW9CLEVBQUUscUNBQXFDO1lBQzNELGlCQUFpQixFQUFFLDZCQUE2QjtZQUNoRCx3QkFBd0I7WUFDeEIsOENBQThDO1lBQzlDLDBCQUEwQixFQUFFLG9CQUFvQjtZQUNoRCxvQkFBb0IsRUFBRSxpQkFBaUI7WUFDdkMsNkJBQTZCLEVBQUUsd0JBQXdCO1lBQ3ZELDBCQUEwQjtTQUMzQixDQUFDO1FBRUYsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUVyRSxPQUFPLE9BQUMsUUFBUSxDQUFDLE1BQU0sbUNBQUksRUFBRSxDQUFDO2FBQzNCLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzNDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO2FBQ2pELE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxzRUFBc0U7SUFDaEgsQ0FBQztDQUNGO0FBaklELGtDQWlJQztBQUVEOzs7Ozs7Ozs7O0dBVUc7QUFDSCxLQUFLLFVBQVUsV0FBVyxDQUFDLEdBQWU7SUFDeEMsSUFBSSxhQUFhLEtBQUssU0FBUyxFQUFFO1FBQy9CLElBQUk7WUFDRixNQUFNLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNwQixhQUFhLEdBQUcsSUFBSSxDQUFDO1NBQ3RCO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixhQUFhLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLE1BQU0sSUFBSSxLQUFLLENBQUMsdURBQXVELENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1NBQ3JGO0tBQ0Y7SUFDRCxJQUFJLENBQUMsYUFBYSxFQUFFO1FBQ2xCLE1BQU0sSUFBSSxLQUFLLENBQUMsNkRBQTZELENBQUMsQ0FBQztLQUNoRjtBQUNILENBQUM7QUFDRCxJQUFJLGFBQWtDLENBQUM7QUFFdkM7Ozs7O0dBS0c7QUFDSCxLQUFLLFVBQVUsa0JBQWtCLENBQUMsT0FBb0I7SUFDcEQsOENBQThDO0lBQzlDLElBQUksTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsS0FBSyxTQUFTLEVBQUU7UUFDN0QsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsV0FBVyxFQUFFLFNBQVMsTUFBTSxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ2hHO0FBQ0gsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSSxLQUFLLFVBQVUsS0FBSyxDQUFDLE9BQWlCLEVBQUUsVUFBd0IsRUFBRTs7SUFDdkUsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLE9BQU8sQ0FBQyxHQUFHLEVBQUU7UUFDakMsTUFBTSxJQUFJLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0tBQzFEO0lBRUQsTUFBQSxPQUFPLENBQUMsTUFBTSwwQ0FBRSxLQUFLLENBQUMsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7SUFFbkQsTUFBTSxHQUFHLFNBQUcsT0FBTyxDQUFDLEdBQUcsbUNBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEdBQUcsT0FBTyxDQUFDLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFaEcsTUFBTSxLQUFLLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUM5RCxHQUFHLE9BQU87UUFDVixHQUFHO1FBQ0gseUVBQXlFO1FBQ3pFLEtBQUssRUFBRSxJQUFJO1FBQ1gsS0FBSyxFQUFFLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxNQUFNLENBQUM7S0FDbEMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxJQUFJLE9BQU8sQ0FBUyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUM3QyxNQUFNLE1BQU0sR0FBRyxJQUFJLEtBQUssRUFBVSxDQUFDO1FBQ25DLE1BQU0sTUFBTSxHQUFHLElBQUksS0FBSyxFQUFVLENBQUM7UUFFbkMsS0FBSyxDQUFDLE1BQU8sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxFQUFFOztZQUMvQixNQUFBLE9BQU8sQ0FBQyxNQUFNLDBDQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUU7WUFDN0IsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNyQixDQUFDLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyxNQUFPLENBQUMsRUFBRSxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsRUFBRTs7WUFDL0IsTUFBQSxPQUFPLENBQUMsTUFBTSwwQ0FBRSxLQUFLLENBQUMsS0FBSyxFQUFFO1lBQzdCLFVBQUksT0FBTyxDQUFDLGFBQWEsbUNBQUksSUFBSSxFQUFFO2dCQUNqQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3BCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUU1QixLQUFLLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsRUFBRTtZQUN6QixJQUFJLElBQUksS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLFlBQVksRUFBRTtnQkFDdEMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO2FBQ3JHO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLDRCQUE0QixJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDNUU7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTNDRCxzQkEyQ0M7QUFFRCxTQUFTLE9BQU8sQ0FBSSxDQUFJO0lBQ3RCLE9BQU8sQ0FBQyxLQUFLLFNBQVMsQ0FBQztBQUN6QixDQUFDO0FBRUQ7O0dBRUc7QUFDSCxTQUFnQixNQUFNLENBQUMsTUFBYztJQUNuQyxJQUFJO1FBQ0YsTUFBTSxLQUFLLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUVqRCxJQUFJLEtBQUssRUFBRTtZQUNULEtBQUssTUFBTSxJQUFJLElBQUksRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDekMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7YUFDakM7WUFDRCxFQUFFLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3RCO2FBQU07WUFDTCxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ3ZCO0tBQ0Y7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLHlCQUF5QjtRQUN6QixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQUUsTUFBTSxDQUFDLENBQUM7U0FBRTtLQUN0QztBQUNILENBQUM7QUFoQkQsd0JBZ0JDO0FBRUQsU0FBZ0IsWUFBWTtJQUMxQixRQUFRO0lBQ1IsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUhELG9DQUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIG9zIGZyb20gJ29zJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBvdXRwdXRGcm9tU3RhY2ssIEF3c0NsaWVudHMgfSBmcm9tICcuL2F3cy1oZWxwZXJzJztcbmltcG9ydCB7IFJlc291cmNlUG9vbCB9IGZyb20gJy4vcmVzb3VyY2UtcG9vbCc7XG5pbXBvcnQgeyBUZXN0Q29udGV4dCB9IGZyb20gJy4vdGVzdC1oZWxwZXJzJztcblxuY29uc3QgUkVHSU9OUyA9IHByb2Nlc3MuZW52LkFXU19SRUdJT05TXG4gID8gcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTlMuc3BsaXQoJywnKVxuICA6IFtwcm9jZXNzLmVudi5BV1NfUkVHSU9OID8/IHByb2Nlc3MuZW52LkFXU19ERUZBVUxUX1JFR0lPTiA/PyAndXMtZWFzdC0xJ107XG5cbnByb2Nlc3Muc3Rkb3V0LndyaXRlKGBVc2luZyByZWdpb25zOiAke1JFR0lPTlN9XFxuYCk7XG5cbmNvbnN0IFJFR0lPTl9QT09MID0gbmV3IFJlc291cmNlUG9vbChSRUdJT05TKTtcblxuXG5leHBvcnQgdHlwZSBBd3NDb250ZXh0ID0geyByZWFkb25seSBhd3M6IEF3c0NsaWVudHMgfTtcblxuLyoqXG4gKiBIaWdoZXIgb3JkZXIgZnVuY3Rpb24gdG8gZXhlY3V0ZSBhIGJsb2NrIHdpdGggYW4gQVdTIGNsaWVudCBzZXR1cFxuICpcbiAqIEFsbG9jYXRlIHRoZSBuZXh0IHJlZ2lvbiBmcm9tIHRoZSBSRUdJT04gcG9vbCBhbmQgZGlzcG9zZSBpdCBhZnRlcndhcmRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aEF3czxBIGV4dGVuZHMgVGVzdENvbnRleHQ+KGJsb2NrOiAoY29udGV4dDogQSAmIEF3c0NvbnRleHQpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgcmV0dXJuIChjb250ZXh0OiBBKSA9PiBSRUdJT05fUE9PTC51c2luZyhhc3luYyAocmVnaW9uKSA9PiB7XG4gICAgY29uc3QgYXdzID0gYXdhaXQgQXdzQ2xpZW50cy5mb3JSZWdpb24ocmVnaW9uLCBjb250ZXh0Lm91dHB1dCk7XG4gICAgYXdhaXQgc2FuaXR5Q2hlY2soYXdzKTtcblxuICAgIHJldHVybiBibG9jayh7IC4uLmNvbnRleHQsIGF3cyB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogSGlnaGVyIG9yZGVyIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYSBibG9jayB3aXRoIGEgQ0RLIGFwcCBmaXh0dXJlXG4gKlxuICogUmVxdWlyZXMgYW4gQVdTIGNsaWVudCB0byBiZSBwYXNzZWQgaW4uXG4gKlxuICogRm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggZXhpc3RpbmcgdGVzdHMgKHNvIHdlIGRvbid0IGhhdmUgdG8gY2hhbmdlXG4gKiB0b28gbXVjaCkgdGhlIGlubmVyIGJsb2NrIGlzIGV4cGVjdGUgdG8gdGFrZSBhIGBUZXN0Rml4dHVyZWAgb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aENka0FwcDxBIGV4dGVuZHMgVGVzdENvbnRleHQgJiBBd3NDb250ZXh0PihibG9jazogKGNvbnRleHQ6IFRlc3RGaXh0dXJlKSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gIHJldHVybiBhc3luYyAoY29udGV4dDogQSkgPT4ge1xuICAgIGNvbnN0IHJhbmR5ID0gcmFuZG9tU3RyaW5nKCk7XG4gICAgY29uc3Qgc3RhY2tOYW1lUHJlZml4ID0gYGNka3Rlc3QtJHtyYW5keX1gO1xuICAgIGNvbnN0IGludGVnVGVzdERpciA9IHBhdGguam9pbihvcy50bXBkaXIoKSwgYGNkay1pbnRlZy0ke3JhbmR5fWApO1xuXG4gICAgY29udGV4dC5vdXRwdXQud3JpdGUoYCBTdGFjayBwcmVmaXg6ICAgJHtzdGFja05hbWVQcmVmaXh9XFxuYCk7XG4gICAgY29udGV4dC5vdXRwdXQud3JpdGUoYCBUZXN0IGRpcmVjdG9yeTogJHtpbnRlZ1Rlc3REaXJ9XFxuYCk7XG4gICAgY29udGV4dC5vdXRwdXQud3JpdGUoYCBSZWdpb246ICAgICAgICAgJHtjb250ZXh0LmF3cy5yZWdpb259XFxuYCk7XG5cbiAgICBhd2FpdCBjbG9uZURpcmVjdG9yeShwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXBwJyksIGludGVnVGVzdERpciwgY29udGV4dC5vdXRwdXQpO1xuICAgIGNvbnN0IGZpeHR1cmUgPSBuZXcgVGVzdEZpeHR1cmUoXG4gICAgICBpbnRlZ1Rlc3REaXIsXG4gICAgICBzdGFja05hbWVQcmVmaXgsXG4gICAgICBjb250ZXh0Lm91dHB1dCxcbiAgICAgIGNvbnRleHQuYXdzKTtcblxuICAgIGxldCBzdWNjZXNzID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZml4dHVyZS5zaGVsbChbJ25wbScsICdpbnN0YWxsJyxcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmUnLFxuICAgICAgICAnQGF3cy1jZGsvYXdzLXNucycsXG4gICAgICAgICdAYXdzLWNkay9hd3MtaWFtJyxcbiAgICAgICAgJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnLFxuICAgICAgICAnQGF3cy1jZGsvYXdzLXNzbScsXG4gICAgICAgICdAYXdzLWNkay9hd3MtZWNyLWFzc2V0cycsXG4gICAgICAgICdAYXdzLWNkay9hd3MtY2xvdWRmb3JtYXRpb24nLFxuICAgICAgICAnQGF3cy1jZGsvYXdzLWVjMiddKTtcblxuICAgICAgYXdhaXQgZW5zdXJlQm9vdHN0cmFwcGVkKGZpeHR1cmUpO1xuXG4gICAgICBhd2FpdCBibG9jayhmaXh0dXJlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBhd2FpdCBmaXh0dXJlLmRpc3Bvc2Uoc3VjY2Vzcyk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIERlZmF1bHQgdGVzdCBmaXh0dXJlIGZvciBtb3N0IChhbGw/KSBpbnRlZyB0ZXN0c1xuICpcbiAqIEl0J3MgYSBjb21wb3NpdGlvbiBvZiB3aXRoQXdzL3dpdGhDZGtBcHAsIGV4cGVjdGluZyB0aGUgdGVzdCBibG9jayB0byB0YWtlIGEgYFRlc3RGaXh0dXJlYFxuICogb2JqZWN0LlxuICpcbiAqIFdlIGNvdWxkIGhhdmUgcHV0IGB3aXRoQXdzKHdpdGhDZGtBcHAoZml4dHVyZSA9PiB7IC8uLi4gYWN0dWFsIHRlc3QgaGVyZS4uLi8gfSkpYCBpbiBldmVyeVxuICogdGVzdCBkZWNsYXJhdGlvbiBidXQgY2VudHJhbGl6aW5nIGl0IGlzIGdvaW5nIHRvIG1ha2UgaXQgY29udmVuaWVudCB0byBtb2RpZnkgaW4gdGhlIGZ1dHVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhEZWZhdWx0Rml4dHVyZShibG9jazogKGNvbnRleHQ6IFRlc3RGaXh0dXJlKSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gIHJldHVybiB3aXRoQXdzPFRlc3RDb250ZXh0Pih3aXRoQ2RrQXBwKGJsb2NrKSk7XG4gIC8vICAgICAgICAgICAgICBefn5+fn4gdGhpcyBpcyBkaXNhcHBvaW50aW5nIFR5cGVTY3JpcHQhIEZlZWxzIGxpa2UgeW91IHNob3VsZCBoYXZlIGJlZW4gYWJsZSB0byBkZXJpdmUgdGhpcy5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTaGVsbE9wdGlvbnMgZXh0ZW5kcyBjaGlsZF9wcm9jZXNzLlNwYXduT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBQcm9wZXJ0aWVzIHRvIGFkZCB0byAnZW52J1xuICAgKi9cbiAgbW9kRW52PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcblxuICAvKipcbiAgICogRG9uJ3QgZmFpbCB3aGVuIGV4aXRpbmcgd2l0aCBhbiBlcnJvclxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgYWxsb3dFcnJFeGl0PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBjYXB0dXJlIHN0ZGVyclxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBjYXB0dXJlU3RkZXJyPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogUGFzcyBvdXRwdXQgaGVyZVxuICAgKi9cbiAgb3V0cHV0PzogTm9kZUpTLldyaXRhYmxlU3RyZWFtO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENka0NsaU9wdGlvbnMgZXh0ZW5kcyBTaGVsbE9wdGlvbnMge1xuICBvcHRpb25zPzogc3RyaW5nW107XG4gIG5ldmVyUmVxdWlyZUFwcHJvdmFsPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBQcmVwYXJlIGEgdGFyZ2V0IGRpciBieXJlcGxpY2F0aW5nIGEgc291cmNlIGRpcmVjdG9yeVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xvbmVEaXJlY3Rvcnkoc291cmNlOiBzdHJpbmcsIHRhcmdldDogc3RyaW5nLCBvdXRwdXQ/OiBOb2RlSlMuV3JpdGFibGVTdHJlYW0pIHtcbiAgYXdhaXQgc2hlbGwoWydybScsICctcmYnLCB0YXJnZXRdLCB7IG91dHB1dCB9KTtcbiAgYXdhaXQgc2hlbGwoWydta2RpcicsICctcCcsIHRhcmdldF0sIHsgb3V0cHV0IH0pO1xuICBhd2FpdCBzaGVsbChbJ2NwJywgJy1SJywgc291cmNlICsgJy8qJywgdGFyZ2V0XSwgeyBvdXRwdXQgfSk7XG59XG5cbmV4cG9ydCBjbGFzcyBUZXN0Rml4dHVyZSB7XG4gIHB1YmxpYyByZWFkb25seSBxdWFsaWZpZXIgPSByYW5kb21TdHJpbmcoKS5zdWJzdHIoMCwgMTApO1xuICBwcml2YXRlIHJlYWRvbmx5IGJ1Y2tldHNUb0RlbGV0ZSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IGludGVnVGVzdERpcjogc3RyaW5nLFxuICAgIHB1YmxpYyByZWFkb25seSBzdGFja05hbWVQcmVmaXg6IHN0cmluZyxcbiAgICBwdWJsaWMgcmVhZG9ubHkgb3V0cHV0OiBOb2RlSlMuV3JpdGFibGVTdHJlYW0sXG4gICAgcHVibGljIHJlYWRvbmx5IGF3czogQXdzQ2xpZW50cykge1xuICB9XG5cbiAgcHVibGljIGxvZyhzOiBzdHJpbmcpIHtcbiAgICB0aGlzLm91dHB1dC53cml0ZShgJHtzfVxcbmApO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNoZWxsKGNvbW1hbmQ6IHN0cmluZ1tdLCBvcHRpb25zOiBPbWl0PFNoZWxsT3B0aW9ucywgJ2N3ZCd8J291dHB1dCc+ID0ge30pOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBzaGVsbChjb21tYW5kLCB7XG4gICAgICBvdXRwdXQ6IHRoaXMub3V0cHV0LFxuICAgICAgY3dkOiB0aGlzLmludGVnVGVzdERpcixcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgY2RrRGVwbG95KHN0YWNrTmFtZXM6IHN0cmluZyB8IHN0cmluZ1tdLCBvcHRpb25zOiBDZGtDbGlPcHRpb25zID0ge30pIHtcbiAgICBzdGFja05hbWVzID0gdHlwZW9mIHN0YWNrTmFtZXMgPT09ICdzdHJpbmcnID8gW3N0YWNrTmFtZXNdIDogc3RhY2tOYW1lcztcblxuICAgIGNvbnN0IG5ldmVyUmVxdWlyZUFwcHJvdmFsID0gb3B0aW9ucy5uZXZlclJlcXVpcmVBcHByb3ZhbCA/PyB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXMuY2RrKFsnZGVwbG95JyxcbiAgICAgIC4uLihuZXZlclJlcXVpcmVBcHByb3ZhbCA/IFsnLS1yZXF1aXJlLWFwcHJvdmFsPW5ldmVyJ10gOiBbXSksIC8vIERlZmF1bHQgdG8gbm8gYXBwcm92YWwgaW4gYW4gdW5hdHRlbmRlZCB0ZXN0XG4gICAgICAuLi4ob3B0aW9ucy5vcHRpb25zID8/IFtdKSxcbiAgICAgIC4uLnRoaXMuZnVsbFN0YWNrTmFtZShzdGFja05hbWVzKV0sIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGNka0Rlc3Ryb3koc3RhY2tOYW1lczogc3RyaW5nIHwgc3RyaW5nW10sIG9wdGlvbnM6IENka0NsaU9wdGlvbnMgPSB7fSkge1xuICAgIHN0YWNrTmFtZXMgPSB0eXBlb2Ygc3RhY2tOYW1lcyA9PT0gJ3N0cmluZycgPyBbc3RhY2tOYW1lc10gOiBzdGFja05hbWVzO1xuXG4gICAgcmV0dXJuIHRoaXMuY2RrKFsnZGVzdHJveScsXG4gICAgICAnLWYnLCAvLyBXZSBuZXZlciB3YW50IGEgcHJvbXB0IGluIGFuIHVuYXR0ZW5kZWQgdGVzdFxuICAgICAgLi4uKG9wdGlvbnMub3B0aW9ucyA/PyBbXSksXG4gICAgICAuLi50aGlzLmZ1bGxTdGFja05hbWUoc3RhY2tOYW1lcyldLCBvcHRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBjZGsoYXJnczogc3RyaW5nW10sIG9wdGlvbnM6IENka0NsaU9wdGlvbnMgPSB7fSkge1xuICAgIHJldHVybiB0aGlzLnNoZWxsKFsnY2RrJywgLi4uYXJnc10sIHtcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgICBtb2RFbnY6IHtcbiAgICAgICAgQVdTX1JFR0lPTjogdGhpcy5hd3MucmVnaW9uLFxuICAgICAgICBBV1NfREVGQVVMVF9SRUdJT046IHRoaXMuYXdzLnJlZ2lvbixcbiAgICAgICAgU1RBQ0tfTkFNRV9QUkVGSVg6IHRoaXMuc3RhY2tOYW1lUHJlZml4LFxuICAgICAgICAuLi5vcHRpb25zLm1vZEVudixcbiAgICAgIH0sXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZnVsbFN0YWNrTmFtZShzdGFja05hbWU6IHN0cmluZyk6IHN0cmluZztcbiAgcHVibGljIGZ1bGxTdGFja05hbWUoc3RhY2tOYW1lczogc3RyaW5nW10pOiBzdHJpbmdbXTtcbiAgcHVibGljIGZ1bGxTdGFja05hbWUoc3RhY2tOYW1lczogc3RyaW5nIHwgc3RyaW5nW10pOiBzdHJpbmcgfCBzdHJpbmdbXSB7XG4gICAgaWYgKHR5cGVvZiBzdGFja05hbWVzID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGAke3RoaXMuc3RhY2tOYW1lUHJlZml4fS0ke3N0YWNrTmFtZXN9YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN0YWNrTmFtZXMubWFwKHMgPT4gYCR7dGhpcy5zdGFja05hbWVQcmVmaXh9LSR7c31gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kIHRoaXMgdG8gdGhlIGxpc3Qgb2YgYnVja2V0cyB0byBwb3RlbnRpYWxseSBkZWxldGVcbiAgICpcbiAgICogQXQgdGhlIGVuZCBvZiBhIHRlc3QsIHdlIGNsZWFuIHVwIGJ1Y2tldHMgdGhhdCBtYXkgbm90IGhhdmUgZ290dGVuIGRlc3Ryb3llZFxuICAgKiAoZm9yIHdoYXRldmVyIHJlYXNvbikuXG4gICAqL1xuICBwdWJsaWMgcmVtZW1iZXJUb0RlbGV0ZUJ1Y2tldChidWNrZXROYW1lOiBzdHJpbmcpIHtcbiAgICB0aGlzLmJ1Y2tldHNUb0RlbGV0ZS5wdXNoKGJ1Y2tldE5hbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIENsZWFudXAgbGVmdG92ZXIgc3RhY2tzIGFuZCBidWNrZXRzXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgZGlzcG9zZShzdWNjZXNzOiBib29sZWFuKSB7XG4gICAgY29uc3Qgc3RhY2tzVG9EZWxldGUgPSBhd2FpdCB0aGlzLmRlbGV0ZWFibGVTdGFja3ModGhpcy5zdGFja05hbWVQcmVmaXgpO1xuXG4gICAgLy8gQm9vdHN0cmFwIHN0YWNrcyBoYXZlIGJ1Y2tldHMgdGhhdCBuZWVkIHRvIGJlIGNsZWFuZWRcbiAgICBjb25zdCBidWNrZXROYW1lcyA9IHN0YWNrc1RvRGVsZXRlLm1hcChzdGFjayA9PiBvdXRwdXRGcm9tU3RhY2soJ0J1Y2tldE5hbWUnLCBzdGFjaykpLmZpbHRlcihkZWZpbmVkKTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChidWNrZXROYW1lcy5tYXAoYiA9PiB0aGlzLmF3cy5lbXB0eUJ1Y2tldChiKSkpO1xuXG4gICAgLy8gQm9vdHN0cmFwIHN0YWNrcyBoYXZlIEVDUiByZXBvc2l0b3JpZXMgd2l0aCBpbWFnZXMgd2hpY2ggc2hvdWxkIGJlIGRlbGV0ZWRcbiAgICBjb25zdCBpbWFnZVJlcG9zaXRvcnlOYW1lcyA9IHN0YWNrc1RvRGVsZXRlLm1hcChzdGFjayA9PiBvdXRwdXRGcm9tU3RhY2soJ0ltYWdlUmVwb3NpdG9yeU5hbWUnLCBzdGFjaykpLmZpbHRlcihkZWZpbmVkKTtcbiAgICBhd2FpdCBQcm9taXNlLmFsbChpbWFnZVJlcG9zaXRvcnlOYW1lcy5tYXAociA9PiB0aGlzLmF3cy5kZWxldGVJbWFnZVJlcG9zaXRvcnkocikpKTtcblxuICAgIGF3YWl0IHRoaXMuYXdzLmRlbGV0ZVN0YWNrcyguLi5zdGFja3NUb0RlbGV0ZS5tYXAocyA9PiBzLlN0YWNrTmFtZSkpO1xuXG4gICAgLy8gV2UgbWlnaHQgaGF2ZSBsZWFrZWQgc29tZSBidWNrZXRzIGJ5IHVwZ3JhZGluZyB0aGUgYm9vdHN0cmFwIHN0YWNrLiBCZVxuICAgIC8vIHN1cmUgdG8gY2xlYW4gZXZlcnl0aGluZy5cbiAgICBmb3IgKGNvbnN0IGJ1Y2tldCBvZiB0aGlzLmJ1Y2tldHNUb0RlbGV0ZSkge1xuICAgICAgYXdhaXQgdGhpcy5hd3MuZGVsZXRlQnVja2V0KGJ1Y2tldCk7XG4gICAgfVxuXG4gICAgLy8gSWYgdGhlIHRlc3RzIGNvbXBsZXRlZCBzdWNjZXNzZnVsbHksIGhhcHBpbHkgZGVsZXRlIHRoZSBmaXh0dXJlXG4gICAgLy8gKG90aGVyd2lzZSBsZWF2ZSBpdCBmb3IgaHVtYW5zIHRvIGluc3BlY3QpXG4gICAgaWYgKHN1Y2Nlc3MpIHtcbiAgICAgIHJpbXJhZih0aGlzLmludGVnVGVzdERpcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgc3RhY2tzIHN0YXJ0aW5nIHdpdGggb3VyIHRlc3RpbmcgcHJlZml4IHRoYXQgc2hvdWxkIGJlIGRlbGV0ZWRcbiAgICovXG4gIHByaXZhdGUgYXN5bmMgZGVsZXRlYWJsZVN0YWNrcyhwcmVmaXg6IHN0cmluZyk6IFByb21pc2U8QVdTLkNsb3VkRm9ybWF0aW9uLlN0YWNrW10+IHtcbiAgICBjb25zdCBzdGF0dXNGaWx0ZXIgPSBbXG4gICAgICAnQ1JFQVRFX0lOX1BST0dSRVNTJywgJ0NSRUFURV9GQUlMRUQnLCAnQ1JFQVRFX0NPTVBMRVRFJyxcbiAgICAgICdST0xMQkFDS19JTl9QUk9HUkVTUycsICdST0xMQkFDS19GQUlMRUQnLCAnUk9MTEJBQ0tfQ09NUExFVEUnLFxuICAgICAgJ0RFTEVURV9GQUlMRUQnLFxuICAgICAgJ1VQREFURV9JTl9QUk9HUkVTUycsICdVUERBVEVfQ09NUExFVEVfQ0xFQU5VUF9JTl9QUk9HUkVTUycsXG4gICAgICAnVVBEQVRFX0NPTVBMRVRFJywgJ1VQREFURV9ST0xMQkFDS19JTl9QUk9HUkVTUycsXG4gICAgICAnVVBEQVRFX1JPTExCQUNLX0ZBSUxFRCcsXG4gICAgICAnVVBEQVRFX1JPTExCQUNLX0NPTVBMRVRFX0NMRUFOVVBfSU5fUFJPR1JFU1MnLFxuICAgICAgJ1VQREFURV9ST0xMQkFDS19DT01QTEVURScsICdSRVZJRVdfSU5fUFJPR1JFU1MnLFxuICAgICAgJ0lNUE9SVF9JTl9QUk9HUkVTUycsICdJTVBPUlRfQ09NUExFVEUnLFxuICAgICAgJ0lNUE9SVF9ST0xMQkFDS19JTl9QUk9HUkVTUycsICdJTVBPUlRfUk9MTEJBQ0tfRkFJTEVEJyxcbiAgICAgICdJTVBPUlRfUk9MTEJBQ0tfQ09NUExFVEUnLFxuICAgIF07XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuYXdzLmNsb3VkRm9ybWF0aW9uKCdkZXNjcmliZVN0YWNrcycsIHt9KTtcblxuICAgIHJldHVybiAocmVzcG9uc2UuU3RhY2tzID8/IFtdKVxuICAgICAgLmZpbHRlcihzID0+IHMuU3RhY2tOYW1lLnN0YXJ0c1dpdGgocHJlZml4KSlcbiAgICAgIC5maWx0ZXIocyA9PiBzdGF0dXNGaWx0ZXIuaW5jbHVkZXMocy5TdGFja1N0YXR1cykpXG4gICAgICAuZmlsdGVyKHMgPT4gcy5Sb290SWQgPT09IHVuZGVmaW5lZCk7IC8vIE9ubHkgZGVsZXRlIHBhcmVudCBzdGFja3MuIE5lc3RlZCBzdGFja3MgYXJlIGRlbGV0ZWQgaW4gdGhlIHByb2Nlc3NcbiAgfVxufVxuXG4vKipcbiAqIFBlcmZvcm0gYSBvbmUtdGltZSBxdWljayBzYW5pdHkgY2hlY2sgdGhhdCB0aGUgQVdTIGNsaWVudHMgaGFzIHByb3Blcmx5IGNvbmZpZ3VyZWQgY3JlZGVudGlhbHNcbiAqXG4gKiBJZiB3ZSBkb24ndCBkbyB0aGlzLCBjYWxscyBhcmUgZ29pbmcgdG8gZmFpbCBhbmQgdGhleSdsbCBiZSByZXRyaWVkIGFuZCBldmVyeXRoaW5nIHdpbGwgdGFrZVxuICogZm9yZXZlciBiZWZvcmUgdGhlIHVzZXIgbm90aWNlcyBhIHNpbXBsZSBtaXNjb25maWd1cmF0aW9uLlxuICpcbiAqIFdlIGNhbid0IGNoZWNrIGZvciB0aGUgcHJlc2VuY2Ugb2YgZW52aXJvbm1lbnQgdmFyaWFibGVzIHNpbmNlIGNyZWRlbnRpYWxzIGNvdWxkIGNvbWUgZnJvbVxuICogYW55d2hlcmUsIHNvIGRvIHNpbXBsZSBhY2NvdW50IHJldHJpZXZhbC5cbiAqXG4gKiBPbmx5IGRvIGl0IG9uY2UgcGVyIHByb2Nlc3MuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHNhbml0eUNoZWNrKGF3czogQXdzQ2xpZW50cykge1xuICBpZiAoc2FuaXR5Q2hlY2tlZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGF3cy5hY2NvdW50KCk7XG4gICAgICBzYW5pdHlDaGVja2VkID0gdHJ1ZTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzYW5pdHlDaGVja2VkID0gZmFsc2U7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEFXUyBjcmVkZW50aWFscyBwcm9iYWJseSBub3QgY29uZmlndXJlZCwgZ290IGVycm9yOiAke2UubWVzc2FnZX1gKTtcbiAgICB9XG4gIH1cbiAgaWYgKCFzYW5pdHlDaGVja2VkKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdBV1MgY3JlZGVudGlhbHMgcHJvYmFibHkgbm90IGNvbmZpZ3VyZWQsIHNlZSBwcmV2aW91cyBlcnJvcicpO1xuICB9XG59XG5sZXQgc2FuaXR5Q2hlY2tlZDogYm9vbGVhbiB8IHVuZGVmaW5lZDtcblxuLyoqXG4gKiBNYWtlIHN1cmUgdGhhdCB0aGUgZ2l2ZW4gZW52aXJvbm1lbnQgaXMgYm9vdHN0cmFwcGVkXG4gKlxuICogU2luY2Ugd2UgZ28gc3RyaXBpbmcgYWNyb3NzIHJlZ2lvbnMsIGl0J3MgZ29pbmcgdG8gc3VjayBkb2luZyB0aGlzXG4gKiBieSBoYW5kIHNvIGxldCdzIGp1c3QgbWFzcy1hdXRvbWF0ZSBpdC5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gZW5zdXJlQm9vdHN0cmFwcGVkKGZpeHR1cmU6IFRlc3RGaXh0dXJlKSB7XG4gIC8vIE9sZC1zdHlsZSBib290c3RyYXAgc3RhY2sgd2l0aCBkZWZhdWx0IG5hbWVcbiAgaWYgKGF3YWl0IGZpeHR1cmUuYXdzLnN0YWNrU3RhdHVzKCdDREtUb29sa2l0JykgPT09IHVuZGVmaW5lZCkge1xuICAgIGF3YWl0IGZpeHR1cmUuY2RrKFsnYm9vdHN0cmFwJywgYGF3czovLyR7YXdhaXQgZml4dHVyZS5hd3MuYWNjb3VudCgpfS8ke2ZpeHR1cmUuYXdzLnJlZ2lvbn1gXSk7XG4gIH1cbn1cblxuLyoqXG4gKiBBIHNoZWxsIGNvbW1hbmQgdGhhdCBkb2VzIHdoYXQgeW91IHdhbnRcbiAqXG4gKiBJcyBwbGF0Zm9ybS1hd2FyZSwgaGFuZGxlcyBlcnJvcnMgbmljZWx5LlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gc2hlbGwoY29tbWFuZDogc3RyaW5nW10sIG9wdGlvbnM6IFNoZWxsT3B0aW9ucyA9IHt9KTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgaWYgKG9wdGlvbnMubW9kRW52ICYmIG9wdGlvbnMuZW52KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdVc2UgZWl0aGVyIGVudiBvciBtb2RFbnYgYnV0IG5vdCBib3RoJyk7XG4gIH1cblxuICBvcHRpb25zLm91dHB1dD8ud3JpdGUoYPCfkrsgJHtjb21tYW5kLmpvaW4oJyAnKX1cXG5gKTtcblxuICBjb25zdCBlbnYgPSBvcHRpb25zLmVudiA/PyAob3B0aW9ucy5tb2RFbnYgPyB7IC4uLnByb2Nlc3MuZW52LCAuLi5vcHRpb25zLm1vZEVudiB9IDogdW5kZWZpbmVkKTtcblxuICBjb25zdCBjaGlsZCA9IGNoaWxkX3Byb2Nlc3Muc3Bhd24oY29tbWFuZFswXSwgY29tbWFuZC5zbGljZSgxKSwge1xuICAgIC4uLm9wdGlvbnMsXG4gICAgZW52LFxuICAgIC8vIE5lZWQgdGhpcyBmb3IgV2luZG93cyB3aGVyZSB3ZSB3YW50IC5jbWQgYW5kIC5iYXQgdG8gYmUgZm91bmQgYXMgd2VsbC5cbiAgICBzaGVsbDogdHJ1ZSxcbiAgICBzdGRpbzogWydpZ25vcmUnLCAncGlwZScsICdwaXBlJ10sXG4gIH0pO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmc+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICBjb25zdCBzdGRvdXQgPSBuZXcgQXJyYXk8QnVmZmVyPigpO1xuICAgIGNvbnN0IHN0ZGVyciA9IG5ldyBBcnJheTxCdWZmZXI+KCk7XG5cbiAgICBjaGlsZC5zdGRvdXQhLm9uKCdkYXRhJywgY2h1bmsgPT4ge1xuICAgICAgb3B0aW9ucy5vdXRwdXQ/LndyaXRlKGNodW5rKTtcbiAgICAgIHN0ZG91dC5wdXNoKGNodW5rKTtcbiAgICB9KTtcblxuICAgIGNoaWxkLnN0ZGVyciEub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgICBvcHRpb25zLm91dHB1dD8ud3JpdGUoY2h1bmspO1xuICAgICAgaWYgKG9wdGlvbnMuY2FwdHVyZVN0ZGVyciA/PyB0cnVlKSB7XG4gICAgICAgIHN0ZGVyci5wdXNoKGNodW5rKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGNoaWxkLm9uY2UoJ2Vycm9yJywgcmVqZWN0KTtcblxuICAgIGNoaWxkLm9uY2UoJ2Nsb3NlJywgY29kZSA9PiB7XG4gICAgICBpZiAoY29kZSA9PT0gMCB8fCBvcHRpb25zLmFsbG93RXJyRXhpdCkge1xuICAgICAgICByZXNvbHZlKChCdWZmZXIuY29uY2F0KHN0ZG91dCkudG9TdHJpbmcoJ3V0Zi04JykgKyBCdWZmZXIuY29uY2F0KHN0ZGVycikudG9TdHJpbmcoJ3V0Zi04JykpLnRyaW0oKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZWplY3QobmV3IEVycm9yKGAnJHtjb21tYW5kLmpvaW4oJyAnKX0nIGV4aXRlZCB3aXRoIGVycm9yIGNvZGUgJHtjb2RlfWApKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRlZmluZWQ8QT4oeDogQSk6IHggaXMgTm9uTnVsbGFibGU8QT4ge1xuICByZXR1cm4geCAhPT0gdW5kZWZpbmVkO1xufVxuXG4vKipcbiAqIHJtIC1yZiByZWltcGxlbWVudGF0aW9uLCBkb24ndCB3YW50IHRvIGRlcGVuZCBvbiBhbiBOUE0gcGFja2FnZSBmb3IgdGhpc1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmltcmFmKGZzUGF0aDogc3RyaW5nKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgaXNEaXIgPSBmcy5sc3RhdFN5bmMoZnNQYXRoKS5pc0RpcmVjdG9yeSgpO1xuXG4gICAgaWYgKGlzRGlyKSB7XG4gICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZnMucmVhZGRpclN5bmMoZnNQYXRoKSkge1xuICAgICAgICByaW1yYWYocGF0aC5qb2luKGZzUGF0aCwgZmlsZSkpO1xuICAgICAgfVxuICAgICAgZnMucm1kaXJTeW5jKGZzUGF0aCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZzLnVubGlua1N5bmMoZnNQYXRoKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBXZSB3aWxsIHN1cnZpdmUgRU5PRU5UXG4gICAgaWYgKGUuY29kZSAhPT0gJ0VOT0VOVCcpIHsgdGhyb3cgZTsgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByYW5kb21TdHJpbmcoKSB7XG4gIC8vIENyYXp5XG4gIHJldHVybiBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5yZXBsYWNlKC9bXmEtejAtOV0rL2csICcnKTtcbn0iXX0=
