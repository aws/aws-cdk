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
const FRAMEWORK_VERSION = process.env.FRAMEWORK_VERSION;
process.stdout.write(`Using regions: ${REGIONS}\n`);
process.stdout.write(`Using framework version: ${FRAMEWORK_VERSION}\n`);
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
 * too much) the inner block is expected to take a `TestFixture` object.
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
            let modules = [
                '@aws-cdk/core',
                '@aws-cdk/aws-sns',
                '@aws-cdk/aws-iam',
                '@aws-cdk/aws-lambda',
                '@aws-cdk/aws-ssm',
                '@aws-cdk/aws-ecr-assets',
                '@aws-cdk/aws-cloudformation',
                '@aws-cdk/aws-ec2',
            ];
            if (FRAMEWORK_VERSION) {
                modules = modules.map(module => `${module}@${FRAMEWORK_VERSION}`);
            }
            await fixture.shell(['npm', 'install', ...modules]);
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
        var _a;
        const verbose = (_a = options.verbose) !== null && _a !== void 0 ? _a : true;
        return this.shell(['cdk', ...(verbose ? ['-v'] : []), ...args], {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsK0NBQStDO0FBQy9DLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLCtDQUE0RDtBQUM1RCxtREFBK0M7QUFHL0MsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXO0lBQ3JDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxhQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxtQ0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixtQ0FBSSxXQUFXLENBQUMsQ0FBQztBQUU5RSxNQUFNLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUM7QUFFeEQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLE9BQU8sSUFBSSxDQUFDLENBQUM7QUFDcEQsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLGlCQUFpQixJQUFJLENBQUMsQ0FBQztBQUV4RSxNQUFNLFdBQVcsR0FBRyxJQUFJLDRCQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7QUFLOUM7Ozs7R0FJRztBQUNILFNBQWdCLE9BQU8sQ0FBd0IsS0FBaUQ7SUFDOUYsT0FBTyxDQUFDLE9BQVUsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDeEQsTUFBTSxHQUFHLEdBQUcsTUFBTSx3QkFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9ELE1BQU0sV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXZCLE9BQU8sS0FBSyxDQUFDLEVBQUUs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QUFDekIsQ0FBQztBQUVEOztHQUVHO0FBQ0gsU0FBZ0IsTUFBTSxDQUFDLE1BQWM7SUFDbkMsSUFBSTtRQUNGLE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFakQsSUFBSSxLQUFLLEVBQUU7WUFDVCxLQUFLLE1BQU0sSUFBSSxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUU7Z0JBQ3pDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ2pDO1lBQ0QsRUFBRSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN0QjthQUFNO1lBQ0wsRUFBRSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUN2QjtLQUNGO0lBQUMsT0FBTyxDQUFDLEVBQUU7UUFDVix5QkFBeUI7UUFDekIsSUFBSSxDQUFDLENBQUMsSUFBSSxLQUFLLFFBQVEsRUFBRTtZQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQUU7S0FDdEM7QUFDSCxDQUFDO0FBaEJELHdCQWdCQztBQUVELFNBQWdCLFlBQVk7SUFDMUIsUUFBUTtJQUNSLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQy9ELENBQUM7QUFIRCxvQ0FHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGNoaWxkX3Byb2Nlc3MgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG5pbXBvcnQgKiBhcyBvcyBmcm9tICdvcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgb3V0cHV0RnJvbVN0YWNrLCBBd3NDbGllbnRzIH0gZnJvbSAnLi9hd3MtaGVscGVycyc7XG5pbXBvcnQgeyBSZXNvdXJjZVBvb2wgfSBmcm9tICcuL3Jlc291cmNlLXBvb2wnO1xuaW1wb3J0IHsgVGVzdENvbnRleHQgfSBmcm9tICcuL3Rlc3QtaGVscGVycyc7XG5cbmNvbnN0IFJFR0lPTlMgPSBwcm9jZXNzLmVudi5BV1NfUkVHSU9OU1xuICA/IHByb2Nlc3MuZW52LkFXU19SRUdJT05TLnNwbGl0KCcsJylcbiAgOiBbcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTiA/PyBwcm9jZXNzLmVudi5BV1NfREVGQVVMVF9SRUdJT04gPz8gJ3VzLWVhc3QtMSddO1xuXG5jb25zdCBGUkFNRVdPUktfVkVSU0lPTiA9IHByb2Nlc3MuZW52LkZSQU1FV09SS19WRVJTSU9OO1xuXG5wcm9jZXNzLnN0ZG91dC53cml0ZShgVXNpbmcgcmVnaW9uczogJHtSRUdJT05TfVxcbmApO1xucHJvY2Vzcy5zdGRvdXQud3JpdGUoYFVzaW5nIGZyYW1ld29yayB2ZXJzaW9uOiAke0ZSQU1FV09SS19WRVJTSU9OfVxcbmApO1xuXG5jb25zdCBSRUdJT05fUE9PTCA9IG5ldyBSZXNvdXJjZVBvb2woUkVHSU9OUyk7XG5cblxuZXhwb3J0IHR5cGUgQXdzQ29udGV4dCA9IHsgcmVhZG9ubHkgYXdzOiBBd3NDbGllbnRzIH07XG5cbi8qKlxuICogSGlnaGVyIG9yZGVyIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYSBibG9jayB3aXRoIGFuIEFXUyBjbGllbnQgc2V0dXBcbiAqXG4gKiBBbGxvY2F0ZSB0aGUgbmV4dCByZWdpb24gZnJvbSB0aGUgUkVHSU9OIHBvb2wgYW5kIGRpc3Bvc2UgaXQgYWZ0ZXJ3YXJkcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhBd3M8QSBleHRlbmRzIFRlc3RDb250ZXh0PihibG9jazogKGNvbnRleHQ6IEEgJiBBd3NDb250ZXh0KSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gIHJldHVybiAoY29udGV4dDogQSkgPT4gUkVHSU9OX1BPT0wudXNpbmcoYXN5bmMgKHJlZ2lvbikgPT4ge1xuICAgIGNvbnN0IGF3cyA9IGF3YWl0IEF3c0NsaWVudHMuZm9yUmVnaW9uKHJlZ2lvbiwgY29udGV4dC5vdXRwdXQpO1xuICAgIGF3YWl0IHNhbml0eUNoZWNrKGF3cyk7XG5cbiAgICByZXR1cm4gYmxvY2soeyAuLi5jb250ZXh0LCBhd3MgfSk7XG4gIH0pO1xufVxuXG4vKipcbiAqIEhpZ2hlciBvcmRlciBmdW5jdGlvbiB0byBleGVjdXRlIGEgYmxvY2sgd2l0aCBhIENESyBhcHAgZml4dHVyZVxuICpcbiAqIFJlcXVpcmVzIGFuIEFXUyBjbGllbnQgdG8gYmUgcGFzc2VkIGluLlxuICpcbiAqIEZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eSB3aXRoIGV4aXN0aW5nIHRlc3RzIChzbyB3ZSBkb24ndCBoYXZlIHRvIGNoYW5nZVxuICogdG9vIG11Y2gpIHRoZSBpbm5lciBibG9jayBpcyBleHBlY3RlZCB0byB0YWtlIGEgYFRlc3RGaXh0dXJlYCBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aXRoQ2RrQXBwPEEgZXh0ZW5kcyBUZXN0Q29udGV4dCAmIEF3c0NvbnRleHQ+KGJsb2NrOiAoY29udGV4dDogVGVzdEZpeHR1cmUpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgcmV0dXJuIGFzeW5jIChjb250ZXh0OiBBKSA9PiB7XG4gICAgY29uc3QgcmFuZHkgPSByYW5kb21TdHJpbmcoKTtcbiAgICBjb25zdCBzdGFja05hbWVQcmVmaXggPSBgY2RrdGVzdC0ke3JhbmR5fWA7XG4gICAgY29uc3QgaW50ZWdUZXN0RGlyID0gcGF0aC5qb2luKG9zLnRtcGRpcigpLCBgY2RrLWludGVnLSR7cmFuZHl9YCk7XG5cbiAgICBjb250ZXh0Lm91dHB1dC53cml0ZShgIFN0YWNrIHByZWZpeDogICAke3N0YWNrTmFtZVByZWZpeH1cXG5gKTtcbiAgICBjb250ZXh0Lm91dHB1dC53cml0ZShgIFRlc3QgZGlyZWN0b3J5OiAke2ludGVnVGVzdERpcn1cXG5gKTtcbiAgICBjb250ZXh0Lm91dHB1dC53cml0ZShgIFJlZ2lvbjogICAgICAgICAke2NvbnRleHQuYXdzLnJlZ2lvbn1cXG5gKTtcblxuICAgIGF3YWl0IGNsb25lRGlyZWN0b3J5KHBhdGguam9pbihfX2Rpcm5hbWUsICdhcHAnKSwgaW50ZWdUZXN0RGlyLCBjb250ZXh0Lm91dHB1dCk7XG4gICAgY29uc3QgZml4dHVyZSA9IG5ldyBUZXN0Rml4dHVyZShcbiAgICAgIGludGVnVGVzdERpcixcbiAgICAgIHN0YWNrTmFtZVByZWZpeCxcbiAgICAgIGNvbnRleHQub3V0cHV0LFxuICAgICAgY29udGV4dC5hd3MpO1xuXG4gICAgbGV0IHN1Y2Nlc3MgPSB0cnVlO1xuICAgIHRyeSB7XG4gICAgICBsZXQgbW9kdWxlcyA9IFtcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmUnLFxuICAgICAgICAnQGF3cy1jZGsvYXdzLXNucycsXG4gICAgICAgICdAYXdzLWNkay9hd3MtaWFtJyxcbiAgICAgICAgJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnLFxuICAgICAgICAnQGF3cy1jZGsvYXdzLXNzbScsXG4gICAgICAgICdAYXdzLWNkay9hd3MtZWNyLWFzc2V0cycsXG4gICAgICAgICdAYXdzLWNkay9hd3MtY2xvdWRmb3JtYXRpb24nLFxuICAgICAgICAnQGF3cy1jZGsvYXdzLWVjMicsXG4gICAgICBdO1xuICAgICAgaWYgKEZSQU1FV09SS19WRVJTSU9OKSB7XG4gICAgICAgIG1vZHVsZXMgPSBtb2R1bGVzLm1hcChtb2R1bGUgPT4gYCR7bW9kdWxlfUAke0ZSQU1FV09SS19WRVJTSU9OfWApO1xuICAgICAgfVxuICAgICAgYXdhaXQgZml4dHVyZS5zaGVsbChbJ25wbScsICdpbnN0YWxsJywgLi4ubW9kdWxlc10pO1xuXG4gICAgICBhd2FpdCBlbnN1cmVCb290c3RyYXBwZWQoZml4dHVyZSk7XG5cbiAgICAgIGF3YWl0IGJsb2NrKGZpeHR1cmUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgIHRocm93IGU7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGF3YWl0IGZpeHR1cmUuZGlzcG9zZShzdWNjZXNzKTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogRGVmYXVsdCB0ZXN0IGZpeHR1cmUgZm9yIG1vc3QgKGFsbD8pIGludGVnIHRlc3RzXG4gKlxuICogSXQncyBhIGNvbXBvc2l0aW9uIG9mIHdpdGhBd3Mvd2l0aENka0FwcCwgZXhwZWN0aW5nIHRoZSB0ZXN0IGJsb2NrIHRvIHRha2UgYSBgVGVzdEZpeHR1cmVgXG4gKiBvYmplY3QuXG4gKlxuICogV2UgY291bGQgaGF2ZSBwdXQgYHdpdGhBd3Mod2l0aENka0FwcChmaXh0dXJlID0+IHsgLy4uLiBhY3R1YWwgdGVzdCBoZXJlLi4uLyB9KSlgIGluIGV2ZXJ5XG4gKiB0ZXN0IGRlY2xhcmF0aW9uIGJ1dCBjZW50cmFsaXppbmcgaXQgaXMgZ29pbmcgdG8gbWFrZSBpdCBjb252ZW5pZW50IHRvIG1vZGlmeSBpbiB0aGUgZnV0dXJlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aERlZmF1bHRGaXh0dXJlKGJsb2NrOiAoY29udGV4dDogVGVzdEZpeHR1cmUpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgcmV0dXJuIHdpdGhBd3M8VGVzdENvbnRleHQ+KHdpdGhDZGtBcHAoYmxvY2spKTtcbiAgLy8gICAgICAgICAgICAgIF5+fn5+fiB0aGlzIGlzIGRpc2FwcG9pbnRpbmcgVHlwZVNjcmlwdCEgRmVlbHMgbGlrZSB5b3Ugc2hvdWxkIGhhdmUgYmVlbiBhYmxlIHRvIGRlcml2ZSB0aGlzLlxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFNoZWxsT3B0aW9ucyBleHRlbmRzIGNoaWxkX3Byb2Nlc3MuU3Bhd25PcHRpb25zIHtcbiAgLyoqXG4gICAqIFByb3BlcnRpZXMgdG8gYWRkIHRvICdlbnYnXG4gICAqL1xuICBtb2RFbnY/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuXG4gIC8qKlxuICAgKiBEb24ndCBmYWlsIHdoZW4gZXhpdGluZyB3aXRoIGFuIGVycm9yXG4gICAqXG4gICAqIEBkZWZhdWx0IGZhbHNlXG4gICAqL1xuICBhbGxvd0VyckV4aXQ/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRvIGNhcHR1cmUgc3RkZXJyXG4gICAqXG4gICAqIEBkZWZhdWx0IHRydWVcbiAgICovXG4gIGNhcHR1cmVTdGRlcnI/OiBib29sZWFuO1xuXG4gIC8qKlxuICAgKiBQYXNzIG91dHB1dCBoZXJlXG4gICAqL1xuICBvdXRwdXQ/OiBOb2RlSlMuV3JpdGFibGVTdHJlYW07XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ2RrQ2xpT3B0aW9ucyBleHRlbmRzIFNoZWxsT3B0aW9ucyB7XG4gIG9wdGlvbnM/OiBzdHJpbmdbXTtcbiAgbmV2ZXJSZXF1aXJlQXBwcm92YWw/OiBib29sZWFuO1xuICB2ZXJib3NlPzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBQcmVwYXJlIGEgdGFyZ2V0IGRpciBieXJlcGxpY2F0aW5nIGEgc291cmNlIGRpcmVjdG9yeVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY2xvbmVEaXJlY3Rvcnkoc291cmNlOiBzdHJpbmcsIHRhcmdldDogc3RyaW5nLCBvdXRwdXQ/OiBOb2RlSlMuV3JpdGFibGVTdHJlYW0pIHtcbiAgYXdhaXQgc2hlbGwoWydybScsICctcmYnLCB0YXJnZXRdLCB7IG91dHB1dCB9KTtcbiAgYXdhaXQgc2hlbGwoWydta2RpcicsICctcCcsIHRhcmdldF0sIHsgb3V0cHV0IH0pO1xuICBhd2FpdCBzaGVsbChbJ2NwJywgJy1SJywgc291cmNlICsgJy8qJywgdGFyZ2V0XSwgeyBvdXRwdXQgfSk7XG59XG5cbmV4cG9ydCBjbGFzcyBUZXN0Rml4dHVyZSB7XG4gIHB1YmxpYyByZWFkb25seSBxdWFsaWZpZXIgPSByYW5kb21TdHJpbmcoKS5zdWJzdHIoMCwgMTApO1xuICBwcml2YXRlIHJlYWRvbmx5IGJ1Y2tldHNUb0RlbGV0ZSA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHJlYWRvbmx5IGludGVnVGVzdERpcjogc3RyaW5nLFxuICAgIHB1YmxpYyByZWFkb25seSBzdGFja05hbWVQcmVmaXg6IHN0cmluZyxcbiAgICBwdWJsaWMgcmVhZG9ubHkgb3V0cHV0OiBOb2RlSlMuV3JpdGFibGVTdHJlYW0sXG4gICAgcHVibGljIHJlYWRvbmx5IGF3czogQXdzQ2xpZW50cykge1xuICB9XG5cbiAgcHVibGljIGxvZyhzOiBzdHJpbmcpIHtcbiAgICB0aGlzLm91dHB1dC53cml0ZShgJHtzfVxcbmApO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIHNoZWxsKGNvbW1hbmQ6IHN0cmluZ1tdLCBvcHRpb25zOiBPbWl0PFNoZWxsT3B0aW9ucywgJ2N3ZCd8J291dHB1dCc+ID0ge30pOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiBzaGVsbChjb21tYW5kLCB7XG4gICAgICBvdXRwdXQ6IHRoaXMub3V0cHV0LFxuICAgICAgY3dkOiB0aGlzLmludGVnVGVzdERpcixcbiAgICAgIC4uLm9wdGlvbnMsXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgY2RrRGVwbG95KHN0YWNrTmFtZXM6IHN0cmluZyB8IHN0cmluZ1tdLCBvcHRpb25zOiBDZGtDbGlPcHRpb25zID0ge30pIHtcbiAgICBzdGFja05hbWVzID0gdHlwZW9mIHN0YWNrTmFtZXMgPT09ICdzdHJpbmcnID8gW3N0YWNrTmFtZXNdIDogc3RhY2tOYW1lcztcblxuICAgIGNvbnN0IG5ldmVyUmVxdWlyZUFwcHJvdmFsID0gb3B0aW9ucy5uZXZlclJlcXVpcmVBcHByb3ZhbCA/PyB0cnVlO1xuXG4gICAgcmV0dXJuIHRoaXMuY2RrKFsnZGVwbG95JyxcbiAgICAgIC4uLihuZXZlclJlcXVpcmVBcHByb3ZhbCA/IFsnLS1yZXF1aXJlLWFwcHJvdmFsPW5ldmVyJ10gOiBbXSksIC8vIERlZmF1bHQgdG8gbm8gYXBwcm92YWwgaW4gYW4gdW5hdHRlbmRlZCB0ZXN0XG4gICAgICAuLi4ob3B0aW9ucy5vcHRpb25zID8/IFtdKSxcbiAgICAgIC4uLnRoaXMuZnVsbFN0YWNrTmFtZShzdGFja05hbWVzKV0sIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGNka0Rlc3Ryb3koc3RhY2tOYW1lczogc3RyaW5nIHwgc3RyaW5nW10sIG9wdGlvbnM6IENka0NsaU9wdGlvbnMgPSB7fSkge1xuICAgIHN0YWNrTmFtZXMgPSB0eXBlb2Ygc3RhY2tOYW1lcyA9PT0gJ3N0cmluZycgPyBbc3RhY2tOYW1lc10gOiBzdGFja05hbWVzO1xuXG4gICAgcmV0dXJuIHRoaXMuY2RrKFsnZGVzdHJveScsXG4gICAgICAnLWYnLCAvLyBXZSBuZXZlciB3YW50IGEgcHJvbXB0IGluIGFuIHVuYXR0ZW5kZWQgdGVzdFxuICAgICAgLi4uKG9wdGlvbnMub3B0aW9ucyA/PyBbXSksXG4gICAgICAuLi50aGlzLmZ1bGxTdGFja05hbWUoc3RhY2tOYW1lcyldLCBvcHRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBjZGsoYXJnczogc3RyaW5nW10sIG9wdGlvbnM6IENka0NsaU9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2UgPz8gdHJ1ZTtcblxuICAgIHJldHVybiB0aGlzLnNoZWxsKFsnY2RrJywgLi4uKHZlcmJvc2UgPyBbJy12J10gOiBbXSksIC4uLmFyZ3NdLCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgbW9kRW52OiB7XG4gICAgICAgIEFXU19SRUdJT046IHRoaXMuYXdzLnJlZ2lvbixcbiAgICAgICAgQVdTX0RFRkFVTFRfUkVHSU9OOiB0aGlzLmF3cy5yZWdpb24sXG4gICAgICAgIFNUQUNLX05BTUVfUFJFRklYOiB0aGlzLnN0YWNrTmFtZVByZWZpeCxcbiAgICAgICAgLi4ub3B0aW9ucy5tb2RFbnYsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGZ1bGxTdGFja05hbWUoc3RhY2tOYW1lOiBzdHJpbmcpOiBzdHJpbmc7XG4gIHB1YmxpYyBmdWxsU3RhY2tOYW1lKHN0YWNrTmFtZXM6IHN0cmluZ1tdKTogc3RyaW5nW107XG4gIHB1YmxpYyBmdWxsU3RhY2tOYW1lKHN0YWNrTmFtZXM6IHN0cmluZyB8IHN0cmluZ1tdKTogc3RyaW5nIHwgc3RyaW5nW10ge1xuICAgIGlmICh0eXBlb2Ygc3RhY2tOYW1lcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBgJHt0aGlzLnN0YWNrTmFtZVByZWZpeH0tJHtzdGFja05hbWVzfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdGFja05hbWVzLm1hcChzID0+IGAke3RoaXMuc3RhY2tOYW1lUHJlZml4fS0ke3N9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZCB0aGlzIHRvIHRoZSBsaXN0IG9mIGJ1Y2tldHMgdG8gcG90ZW50aWFsbHkgZGVsZXRlXG4gICAqXG4gICAqIEF0IHRoZSBlbmQgb2YgYSB0ZXN0LCB3ZSBjbGVhbiB1cCBidWNrZXRzIHRoYXQgbWF5IG5vdCBoYXZlIGdvdHRlbiBkZXN0cm95ZWRcbiAgICogKGZvciB3aGF0ZXZlciByZWFzb24pLlxuICAgKi9cbiAgcHVibGljIHJlbWVtYmVyVG9EZWxldGVCdWNrZXQoYnVja2V0TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5idWNrZXRzVG9EZWxldGUucHVzaChidWNrZXROYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbnVwIGxlZnRvdmVyIHN0YWNrcyBhbmQgYnVja2V0c1xuICAgKi9cbiAgcHVibGljIGFzeW5jIGRpc3Bvc2Uoc3VjY2VzczogYm9vbGVhbikge1xuICAgIGNvbnN0IHN0YWNrc1RvRGVsZXRlID0gYXdhaXQgdGhpcy5kZWxldGVhYmxlU3RhY2tzKHRoaXMuc3RhY2tOYW1lUHJlZml4KTtcblxuICAgIC8vIEJvb3RzdHJhcCBzdGFja3MgaGF2ZSBidWNrZXRzIHRoYXQgbmVlZCB0byBiZSBjbGVhbmVkXG4gICAgY29uc3QgYnVja2V0TmFtZXMgPSBzdGFja3NUb0RlbGV0ZS5tYXAoc3RhY2sgPT4gb3V0cHV0RnJvbVN0YWNrKCdCdWNrZXROYW1lJywgc3RhY2spKS5maWx0ZXIoZGVmaW5lZCk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoYnVja2V0TmFtZXMubWFwKGIgPT4gdGhpcy5hd3MuZW1wdHlCdWNrZXQoYikpKTtcblxuICAgIC8vIEJvb3RzdHJhcCBzdGFja3MgaGF2ZSBFQ1IgcmVwb3NpdG9yaWVzIHdpdGggaW1hZ2VzIHdoaWNoIHNob3VsZCBiZSBkZWxldGVkXG4gICAgY29uc3QgaW1hZ2VSZXBvc2l0b3J5TmFtZXMgPSBzdGFja3NUb0RlbGV0ZS5tYXAoc3RhY2sgPT4gb3V0cHV0RnJvbVN0YWNrKCdJbWFnZVJlcG9zaXRvcnlOYW1lJywgc3RhY2spKS5maWx0ZXIoZGVmaW5lZCk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoaW1hZ2VSZXBvc2l0b3J5TmFtZXMubWFwKHIgPT4gdGhpcy5hd3MuZGVsZXRlSW1hZ2VSZXBvc2l0b3J5KHIpKSk7XG5cbiAgICBhd2FpdCB0aGlzLmF3cy5kZWxldGVTdGFja3MoLi4uc3RhY2tzVG9EZWxldGUubWFwKHMgPT4gcy5TdGFja05hbWUpKTtcblxuICAgIC8vIFdlIG1pZ2h0IGhhdmUgbGVha2VkIHNvbWUgYnVja2V0cyBieSB1cGdyYWRpbmcgdGhlIGJvb3RzdHJhcCBzdGFjay4gQmVcbiAgICAvLyBzdXJlIHRvIGNsZWFuIGV2ZXJ5dGhpbmcuXG4gICAgZm9yIChjb25zdCBidWNrZXQgb2YgdGhpcy5idWNrZXRzVG9EZWxldGUpIHtcbiAgICAgIGF3YWl0IHRoaXMuYXdzLmRlbGV0ZUJ1Y2tldChidWNrZXQpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSB0ZXN0cyBjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5LCBoYXBwaWx5IGRlbGV0ZSB0aGUgZml4dHVyZVxuICAgIC8vIChvdGhlcndpc2UgbGVhdmUgaXQgZm9yIGh1bWFucyB0byBpbnNwZWN0KVxuICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICByaW1yYWYodGhpcy5pbnRlZ1Rlc3REaXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHN0YWNrcyBzdGFydGluZyB3aXRoIG91ciB0ZXN0aW5nIHByZWZpeCB0aGF0IHNob3VsZCBiZSBkZWxldGVkXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIGRlbGV0ZWFibGVTdGFja3MocHJlZml4OiBzdHJpbmcpOiBQcm9taXNlPEFXUy5DbG91ZEZvcm1hdGlvbi5TdGFja1tdPiB7XG4gICAgY29uc3Qgc3RhdHVzRmlsdGVyID0gW1xuICAgICAgJ0NSRUFURV9JTl9QUk9HUkVTUycsICdDUkVBVEVfRkFJTEVEJywgJ0NSRUFURV9DT01QTEVURScsXG4gICAgICAnUk9MTEJBQ0tfSU5fUFJPR1JFU1MnLCAnUk9MTEJBQ0tfRkFJTEVEJywgJ1JPTExCQUNLX0NPTVBMRVRFJyxcbiAgICAgICdERUxFVEVfRkFJTEVEJyxcbiAgICAgICdVUERBVEVfSU5fUFJPR1JFU1MnLCAnVVBEQVRFX0NPTVBMRVRFX0NMRUFOVVBfSU5fUFJPR1JFU1MnLFxuICAgICAgJ1VQREFURV9DT01QTEVURScsICdVUERBVEVfUk9MTEJBQ0tfSU5fUFJPR1JFU1MnLFxuICAgICAgJ1VQREFURV9ST0xMQkFDS19GQUlMRUQnLFxuICAgICAgJ1VQREFURV9ST0xMQkFDS19DT01QTEVURV9DTEVBTlVQX0lOX1BST0dSRVNTJyxcbiAgICAgICdVUERBVEVfUk9MTEJBQ0tfQ09NUExFVEUnLCAnUkVWSUVXX0lOX1BST0dSRVNTJyxcbiAgICAgICdJTVBPUlRfSU5fUFJPR1JFU1MnLCAnSU1QT1JUX0NPTVBMRVRFJyxcbiAgICAgICdJTVBPUlRfUk9MTEJBQ0tfSU5fUFJPR1JFU1MnLCAnSU1QT1JUX1JPTExCQUNLX0ZBSUxFRCcsXG4gICAgICAnSU1QT1JUX1JPTExCQUNLX0NPTVBMRVRFJyxcbiAgICBdO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmF3cy5jbG91ZEZvcm1hdGlvbignZGVzY3JpYmVTdGFja3MnLCB7fSk7XG5cbiAgICByZXR1cm4gKHJlc3BvbnNlLlN0YWNrcyA/PyBbXSlcbiAgICAgIC5maWx0ZXIocyA9PiBzLlN0YWNrTmFtZS5zdGFydHNXaXRoKHByZWZpeCkpXG4gICAgICAuZmlsdGVyKHMgPT4gc3RhdHVzRmlsdGVyLmluY2x1ZGVzKHMuU3RhY2tTdGF0dXMpKVxuICAgICAgLmZpbHRlcihzID0+IHMuUm9vdElkID09PSB1bmRlZmluZWQpOyAvLyBPbmx5IGRlbGV0ZSBwYXJlbnQgc3RhY2tzLiBOZXN0ZWQgc3RhY2tzIGFyZSBkZWxldGVkIGluIHRoZSBwcm9jZXNzXG4gIH1cbn1cblxuLyoqXG4gKiBQZXJmb3JtIGEgb25lLXRpbWUgcXVpY2sgc2FuaXR5IGNoZWNrIHRoYXQgdGhlIEFXUyBjbGllbnRzIGhhcyBwcm9wZXJseSBjb25maWd1cmVkIGNyZWRlbnRpYWxzXG4gKlxuICogSWYgd2UgZG9uJ3QgZG8gdGhpcywgY2FsbHMgYXJlIGdvaW5nIHRvIGZhaWwgYW5kIHRoZXknbGwgYmUgcmV0cmllZCBhbmQgZXZlcnl0aGluZyB3aWxsIHRha2VcbiAqIGZvcmV2ZXIgYmVmb3JlIHRoZSB1c2VyIG5vdGljZXMgYSBzaW1wbGUgbWlzY29uZmlndXJhdGlvbi5cbiAqXG4gKiBXZSBjYW4ndCBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIGVudmlyb25tZW50IHZhcmlhYmxlcyBzaW5jZSBjcmVkZW50aWFscyBjb3VsZCBjb21lIGZyb21cbiAqIGFueXdoZXJlLCBzbyBkbyBzaW1wbGUgYWNjb3VudCByZXRyaWV2YWwuXG4gKlxuICogT25seSBkbyBpdCBvbmNlIHBlciBwcm9jZXNzLlxuICovXG5hc3luYyBmdW5jdGlvbiBzYW5pdHlDaGVjayhhd3M6IEF3c0NsaWVudHMpIHtcbiAgaWYgKHNhbml0eUNoZWNrZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBhd3MuYWNjb3VudCgpO1xuICAgICAgc2FuaXR5Q2hlY2tlZCA9IHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2FuaXR5Q2hlY2tlZCA9IGZhbHNlO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBV1MgY3JlZGVudGlhbHMgcHJvYmFibHkgbm90IGNvbmZpZ3VyZWQsIGdvdCBlcnJvcjogJHtlLm1lc3NhZ2V9YCk7XG4gICAgfVxuICB9XG4gIGlmICghc2FuaXR5Q2hlY2tlZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQVdTIGNyZWRlbnRpYWxzIHByb2JhYmx5IG5vdCBjb25maWd1cmVkLCBzZWUgcHJldmlvdXMgZXJyb3InKTtcbiAgfVxufVxubGV0IHNhbml0eUNoZWNrZWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbi8qKlxuICogTWFrZSBzdXJlIHRoYXQgdGhlIGdpdmVuIGVudmlyb25tZW50IGlzIGJvb3RzdHJhcHBlZFxuICpcbiAqIFNpbmNlIHdlIGdvIHN0cmlwaW5nIGFjcm9zcyByZWdpb25zLCBpdCdzIGdvaW5nIHRvIHN1Y2sgZG9pbmcgdGhpc1xuICogYnkgaGFuZCBzbyBsZXQncyBqdXN0IG1hc3MtYXV0b21hdGUgaXQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGVuc3VyZUJvb3RzdHJhcHBlZChmaXh0dXJlOiBUZXN0Rml4dHVyZSkge1xuICAvLyBPbGQtc3R5bGUgYm9vdHN0cmFwIHN0YWNrIHdpdGggZGVmYXVsdCBuYW1lXG4gIGlmIChhd2FpdCBmaXh0dXJlLmF3cy5zdGFja1N0YXR1cygnQ0RLVG9vbGtpdCcpID09PSB1bmRlZmluZWQpIHtcbiAgICBhd2FpdCBmaXh0dXJlLmNkayhbJ2Jvb3RzdHJhcCcsIGBhd3M6Ly8ke2F3YWl0IGZpeHR1cmUuYXdzLmFjY291bnQoKX0vJHtmaXh0dXJlLmF3cy5yZWdpb259YF0pO1xuICB9XG59XG5cbi8qKlxuICogQSBzaGVsbCBjb21tYW5kIHRoYXQgZG9lcyB3aGF0IHlvdSB3YW50XG4gKlxuICogSXMgcGxhdGZvcm0tYXdhcmUsIGhhbmRsZXMgZXJyb3JzIG5pY2VseS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNoZWxsKGNvbW1hbmQ6IHN0cmluZ1tdLCBvcHRpb25zOiBTaGVsbE9wdGlvbnMgPSB7fSk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGlmIChvcHRpb25zLm1vZEVudiAmJiBvcHRpb25zLmVudikge1xuICAgIHRocm93IG5ldyBFcnJvcignVXNlIGVpdGhlciBlbnYgb3IgbW9kRW52IGJ1dCBub3QgYm90aCcpO1xuICB9XG5cbiAgb3B0aW9ucy5vdXRwdXQ/LndyaXRlKGDwn5K7ICR7Y29tbWFuZC5qb2luKCcgJyl9XFxuYCk7XG5cbiAgY29uc3QgZW52ID0gb3B0aW9ucy5lbnYgPz8gKG9wdGlvbnMubW9kRW52ID8geyAuLi5wcm9jZXNzLmVudiwgLi4ub3B0aW9ucy5tb2RFbnYgfSA6IHVuZGVmaW5lZCk7XG5cbiAgY29uc3QgY2hpbGQgPSBjaGlsZF9wcm9jZXNzLnNwYXduKGNvbW1hbmRbMF0sIGNvbW1hbmQuc2xpY2UoMSksIHtcbiAgICAuLi5vcHRpb25zLFxuICAgIGVudixcbiAgICAvLyBOZWVkIHRoaXMgZm9yIFdpbmRvd3Mgd2hlcmUgd2Ugd2FudCAuY21kIGFuZCAuYmF0IHRvIGJlIGZvdW5kIGFzIHdlbGwuXG4gICAgc2hlbGw6IHRydWUsXG4gICAgc3RkaW86IFsnaWdub3JlJywgJ3BpcGUnLCAncGlwZSddLFxuICB9KTtcblxuICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3Qgc3Rkb3V0ID0gbmV3IEFycmF5PEJ1ZmZlcj4oKTtcbiAgICBjb25zdCBzdGRlcnIgPSBuZXcgQXJyYXk8QnVmZmVyPigpO1xuXG4gICAgY2hpbGQuc3Rkb3V0IS5vbignZGF0YScsIGNodW5rID0+IHtcbiAgICAgIG9wdGlvbnMub3V0cHV0Py53cml0ZShjaHVuayk7XG4gICAgICBzdGRvdXQucHVzaChjaHVuayk7XG4gICAgfSk7XG5cbiAgICBjaGlsZC5zdGRlcnIhLm9uKCdkYXRhJywgY2h1bmsgPT4ge1xuICAgICAgb3B0aW9ucy5vdXRwdXQ/LndyaXRlKGNodW5rKTtcbiAgICAgIGlmIChvcHRpb25zLmNhcHR1cmVTdGRlcnIgPz8gdHJ1ZSkge1xuICAgICAgICBzdGRlcnIucHVzaChjaHVuayk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjaGlsZC5vbmNlKCdlcnJvcicsIHJlamVjdCk7XG5cbiAgICBjaGlsZC5vbmNlKCdjbG9zZScsIGNvZGUgPT4ge1xuICAgICAgaWYgKGNvZGUgPT09IDAgfHwgb3B0aW9ucy5hbGxvd0VyckV4aXQpIHtcbiAgICAgICAgcmVzb2x2ZSgoQnVmZmVyLmNvbmNhdChzdGRvdXQpLnRvU3RyaW5nKCd1dGYtOCcpICsgQnVmZmVyLmNvbmNhdChzdGRlcnIpLnRvU3RyaW5nKCd1dGYtOCcpKS50cmltKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgJyR7Y29tbWFuZC5qb2luKCcgJyl9JyBleGl0ZWQgd2l0aCBlcnJvciBjb2RlICR7Y29kZX1gKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVkPEE+KHg6IEEpOiB4IGlzIE5vbk51bGxhYmxlPEE+IHtcbiAgcmV0dXJuIHggIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBybSAtcmYgcmVpbXBsZW1lbnRhdGlvbiwgZG9uJ3Qgd2FudCB0byBkZXBlbmQgb24gYW4gTlBNIHBhY2thZ2UgZm9yIHRoaXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJpbXJhZihmc1BhdGg6IHN0cmluZykge1xuICB0cnkge1xuICAgIGNvbnN0IGlzRGlyID0gZnMubHN0YXRTeW5jKGZzUGF0aCkuaXNEaXJlY3RvcnkoKTtcblxuICAgIGlmIChpc0Rpcikge1xuICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZzLnJlYWRkaXJTeW5jKGZzUGF0aCkpIHtcbiAgICAgICAgcmltcmFmKHBhdGguam9pbihmc1BhdGgsIGZpbGUpKTtcbiAgICAgIH1cbiAgICAgIGZzLnJtZGlyU3luYyhmc1BhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcy51bmxpbmtTeW5jKGZzUGF0aCk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gV2Ugd2lsbCBzdXJ2aXZlIEVOT0VOVFxuICAgIGlmIChlLmNvZGUgIT09ICdFTk9FTlQnKSB7IHRocm93IGU7IH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tU3RyaW5nKCkge1xuICAvLyBDcmF6eVxuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikucmVwbGFjZSgvW15hLXowLTldKy9nLCAnJyk7XG59Il19