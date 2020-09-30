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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsK0NBQStDO0FBQy9DLHlCQUF5QjtBQUN6Qix5QkFBeUI7QUFDekIsNkJBQTZCO0FBQzdCLCtDQUE0RDtBQUM1RCxtREFBK0M7QUFHL0MsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXO0lBQ3JDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxhQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsVUFBVSxtQ0FBSSxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixtQ0FBSSxXQUFXLENBQUMsQ0FBQztBQUU5RSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsT0FBTyxJQUFJLENBQUMsQ0FBQztBQUVwRCxNQUFNLFdBQVcsR0FBRyxJQUFJLDRCQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7QUFLOUM7Ozs7R0FJRztBQUNILFNBQWdCLE9BQU8sQ0FBd0IsS0FBaUQ7SUFDOUYsT0FBTyxDQUFDLE9BQVUsRUFBRSxFQUFFLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDeEQsTUFBTSxHQUFHLEdBQUcsTUFBTSx3QkFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9ELE1BQU0sV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXZCLE9BQU8sS0FBSyxDQUFDLEVBQUUsR0FBRyxPQUFPLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNwQyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFQRCwwQkFPQztBQUVEOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQixVQUFVLENBQXFDLEtBQThD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LEVBQUUsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdEI7YUFBTTtZQUNMLEVBQUUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDdkI7S0FDRjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YseUJBQXlCO1FBQ3pCLElBQUksQ0FBQyxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUU7WUFBRSxNQUFNLENBQUMsQ0FBQztTQUFFO0tBQ3RDO0FBQ0gsQ0FBQztBQWhCRCx3QkFnQkM7QUFFRCxTQUFnQixZQUFZO0lBQzFCLFFBQVE7SUFDUixPQUFPLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUMvRCxDQUFDO0FBSEQsb0NBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjaGlsZF9wcm9jZXNzIGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xuaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuaW1wb3J0ICogYXMgb3MgZnJvbSAnb3MnO1xuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IG91dHB1dEZyb21TdGFjaywgQXdzQ2xpZW50cyB9IGZyb20gJy4vYXdzLWhlbHBlcnMnO1xuaW1wb3J0IHsgUmVzb3VyY2VQb29sIH0gZnJvbSAnLi9yZXNvdXJjZS1wb29sJztcbmltcG9ydCB7IFRlc3RDb250ZXh0IH0gZnJvbSAnLi90ZXN0LWhlbHBlcnMnO1xuXG5jb25zdCBSRUdJT05TID0gcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTlNcbiAgPyBwcm9jZXNzLmVudi5BV1NfUkVHSU9OUy5zcGxpdCgnLCcpXG4gIDogW3Byb2Nlc3MuZW52LkFXU19SRUdJT04gPz8gcHJvY2Vzcy5lbnYuQVdTX0RFRkFVTFRfUkVHSU9OID8/ICd1cy1lYXN0LTEnXTtcblxucHJvY2Vzcy5zdGRvdXQud3JpdGUoYFVzaW5nIHJlZ2lvbnM6ICR7UkVHSU9OU31cXG5gKTtcblxuY29uc3QgUkVHSU9OX1BPT0wgPSBuZXcgUmVzb3VyY2VQb29sKFJFR0lPTlMpO1xuXG5cbmV4cG9ydCB0eXBlIEF3c0NvbnRleHQgPSB7IHJlYWRvbmx5IGF3czogQXdzQ2xpZW50cyB9O1xuXG4vKipcbiAqIEhpZ2hlciBvcmRlciBmdW5jdGlvbiB0byBleGVjdXRlIGEgYmxvY2sgd2l0aCBhbiBBV1MgY2xpZW50IHNldHVwXG4gKlxuICogQWxsb2NhdGUgdGhlIG5leHQgcmVnaW9uIGZyb20gdGhlIFJFR0lPTiBwb29sIGFuZCBkaXNwb3NlIGl0IGFmdGVyd2FyZHMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aXRoQXdzPEEgZXh0ZW5kcyBUZXN0Q29udGV4dD4oYmxvY2s6IChjb250ZXh0OiBBICYgQXdzQ29udGV4dCkgPT4gUHJvbWlzZTx2b2lkPikge1xuICByZXR1cm4gKGNvbnRleHQ6IEEpID0+IFJFR0lPTl9QT09MLnVzaW5nKGFzeW5jIChyZWdpb24pID0+IHtcbiAgICBjb25zdCBhd3MgPSBhd2FpdCBBd3NDbGllbnRzLmZvclJlZ2lvbihyZWdpb24sIGNvbnRleHQub3V0cHV0KTtcbiAgICBhd2FpdCBzYW5pdHlDaGVjayhhd3MpO1xuXG4gICAgcmV0dXJuIGJsb2NrKHsgLi4uY29udGV4dCwgYXdzIH0pO1xuICB9KTtcbn1cblxuLyoqXG4gKiBIaWdoZXIgb3JkZXIgZnVuY3Rpb24gdG8gZXhlY3V0ZSBhIGJsb2NrIHdpdGggYSBDREsgYXBwIGZpeHR1cmVcbiAqXG4gKiBSZXF1aXJlcyBhbiBBV1MgY2xpZW50IHRvIGJlIHBhc3NlZCBpbi5cbiAqXG4gKiBGb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHkgd2l0aCBleGlzdGluZyB0ZXN0cyAoc28gd2UgZG9uJ3QgaGF2ZSB0byBjaGFuZ2VcbiAqIHRvbyBtdWNoKSB0aGUgaW5uZXIgYmxvY2sgaXMgZXhwZWN0ZWQgdG8gdGFrZSBhIGBUZXN0Rml4dHVyZWAgb2JqZWN0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aENka0FwcDxBIGV4dGVuZHMgVGVzdENvbnRleHQgJiBBd3NDb250ZXh0PihibG9jazogKGNvbnRleHQ6IFRlc3RGaXh0dXJlKSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gIHJldHVybiBhc3luYyAoY29udGV4dDogQSkgPT4ge1xuICAgIGNvbnN0IHJhbmR5ID0gcmFuZG9tU3RyaW5nKCk7XG4gICAgY29uc3Qgc3RhY2tOYW1lUHJlZml4ID0gYGNka3Rlc3QtJHtyYW5keX1gO1xuICAgIGNvbnN0IGludGVnVGVzdERpciA9IHBhdGguam9pbihvcy50bXBkaXIoKSwgYGNkay1pbnRlZy0ke3JhbmR5fWApO1xuXG4gICAgY29udGV4dC5vdXRwdXQud3JpdGUoYCBTdGFjayBwcmVmaXg6ICAgJHtzdGFja05hbWVQcmVmaXh9XFxuYCk7XG4gICAgY29udGV4dC5vdXRwdXQud3JpdGUoYCBUZXN0IGRpcmVjdG9yeTogJHtpbnRlZ1Rlc3REaXJ9XFxuYCk7XG4gICAgY29udGV4dC5vdXRwdXQud3JpdGUoYCBSZWdpb246ICAgICAgICAgJHtjb250ZXh0LmF3cy5yZWdpb259XFxuYCk7XG5cbiAgICBhd2FpdCBjbG9uZURpcmVjdG9yeShwYXRoLmpvaW4oX19kaXJuYW1lLCAnYXBwJyksIGludGVnVGVzdERpciwgY29udGV4dC5vdXRwdXQpO1xuICAgIGNvbnN0IGZpeHR1cmUgPSBuZXcgVGVzdEZpeHR1cmUoXG4gICAgICBpbnRlZ1Rlc3REaXIsXG4gICAgICBzdGFja05hbWVQcmVmaXgsXG4gICAgICBjb250ZXh0Lm91dHB1dCxcbiAgICAgIGNvbnRleHQuYXdzKTtcblxuICAgIGxldCBzdWNjZXNzID0gdHJ1ZTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgZml4dHVyZS5zaGVsbChbJ25wbScsICdpbnN0YWxsJyxcbiAgICAgICAgJ0Bhd3MtY2RrL2NvcmUnLFxuICAgICAgICAnQGF3cy1jZGsvYXdzLXNucycsXG4gICAgICAgICdAYXdzLWNkay9hd3MtaWFtJyxcbiAgICAgICAgJ0Bhd3MtY2RrL2F3cy1sYW1iZGEnLFxuICAgICAgICAnQGF3cy1jZGsvYXdzLXNzbScsXG4gICAgICAgICdAYXdzLWNkay9hd3MtZWNyLWFzc2V0cycsXG4gICAgICAgICdAYXdzLWNkay9hd3MtY2xvdWRmb3JtYXRpb24nLFxuICAgICAgICAnQGF3cy1jZGsvYXdzLWVjMiddKTtcblxuICAgICAgYXdhaXQgZW5zdXJlQm9vdHN0cmFwcGVkKGZpeHR1cmUpO1xuXG4gICAgICBhd2FpdCBibG9jayhmaXh0dXJlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBzdWNjZXNzID0gZmFsc2U7XG4gICAgICB0aHJvdyBlO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBhd2FpdCBmaXh0dXJlLmRpc3Bvc2Uoc3VjY2Vzcyk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIERlZmF1bHQgdGVzdCBmaXh0dXJlIGZvciBtb3N0IChhbGw/KSBpbnRlZyB0ZXN0c1xuICpcbiAqIEl0J3MgYSBjb21wb3NpdGlvbiBvZiB3aXRoQXdzL3dpdGhDZGtBcHAsIGV4cGVjdGluZyB0aGUgdGVzdCBibG9jayB0byB0YWtlIGEgYFRlc3RGaXh0dXJlYFxuICogb2JqZWN0LlxuICpcbiAqIFdlIGNvdWxkIGhhdmUgcHV0IGB3aXRoQXdzKHdpdGhDZGtBcHAoZml4dHVyZSA9PiB7IC8uLi4gYWN0dWFsIHRlc3QgaGVyZS4uLi8gfSkpYCBpbiBldmVyeVxuICogdGVzdCBkZWNsYXJhdGlvbiBidXQgY2VudHJhbGl6aW5nIGl0IGlzIGdvaW5nIHRvIG1ha2UgaXQgY29udmVuaWVudCB0byBtb2RpZnkgaW4gdGhlIGZ1dHVyZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhEZWZhdWx0Rml4dHVyZShibG9jazogKGNvbnRleHQ6IFRlc3RGaXh0dXJlKSA9PiBQcm9taXNlPHZvaWQ+KSB7XG4gIHJldHVybiB3aXRoQXdzPFRlc3RDb250ZXh0Pih3aXRoQ2RrQXBwKGJsb2NrKSk7XG4gIC8vICAgICAgICAgICAgICBefn5+fn4gdGhpcyBpcyBkaXNhcHBvaW50aW5nIFR5cGVTY3JpcHQhIEZlZWxzIGxpa2UgeW91IHNob3VsZCBoYXZlIGJlZW4gYWJsZSB0byBkZXJpdmUgdGhpcy5cbn1cblxuZXhwb3J0IGludGVyZmFjZSBTaGVsbE9wdGlvbnMgZXh0ZW5kcyBjaGlsZF9wcm9jZXNzLlNwYXduT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBQcm9wZXJ0aWVzIHRvIGFkZCB0byAnZW52J1xuICAgKi9cbiAgbW9kRW52PzogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcblxuICAvKipcbiAgICogRG9uJ3QgZmFpbCB3aGVuIGV4aXRpbmcgd2l0aCBhbiBlcnJvclxuICAgKlxuICAgKiBAZGVmYXVsdCBmYWxzZVxuICAgKi9cbiAgYWxsb3dFcnJFeGl0PzogYm9vbGVhbjtcblxuICAvKipcbiAgICogV2hldGhlciB0byBjYXB0dXJlIHN0ZGVyclxuICAgKlxuICAgKiBAZGVmYXVsdCB0cnVlXG4gICAqL1xuICBjYXB0dXJlU3RkZXJyPzogYm9vbGVhbjtcblxuICAvKipcbiAgICogUGFzcyBvdXRwdXQgaGVyZVxuICAgKi9cbiAgb3V0cHV0PzogTm9kZUpTLldyaXRhYmxlU3RyZWFtO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENka0NsaU9wdGlvbnMgZXh0ZW5kcyBTaGVsbE9wdGlvbnMge1xuICBvcHRpb25zPzogc3RyaW5nW107XG4gIG5ldmVyUmVxdWlyZUFwcHJvdmFsPzogYm9vbGVhbjtcbiAgdmVyYm9zZT86IGJvb2xlYW47XG59XG5cbi8qKlxuICogUHJlcGFyZSBhIHRhcmdldCBkaXIgYnlyZXBsaWNhdGluZyBhIHNvdXJjZSBkaXJlY3RvcnlcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNsb25lRGlyZWN0b3J5KHNvdXJjZTogc3RyaW5nLCB0YXJnZXQ6IHN0cmluZywgb3V0cHV0PzogTm9kZUpTLldyaXRhYmxlU3RyZWFtKSB7XG4gIGF3YWl0IHNoZWxsKFsncm0nLCAnLXJmJywgdGFyZ2V0XSwgeyBvdXRwdXQgfSk7XG4gIGF3YWl0IHNoZWxsKFsnbWtkaXInLCAnLXAnLCB0YXJnZXRdLCB7IG91dHB1dCB9KTtcbiAgYXdhaXQgc2hlbGwoWydjcCcsICctUicsIHNvdXJjZSArICcvKicsIHRhcmdldF0sIHsgb3V0cHV0IH0pO1xufVxuXG5leHBvcnQgY2xhc3MgVGVzdEZpeHR1cmUge1xuICBwdWJsaWMgcmVhZG9ubHkgcXVhbGlmaWVyID0gcmFuZG9tU3RyaW5nKCkuc3Vic3RyKDAsIDEwKTtcbiAgcHJpdmF0ZSByZWFkb25seSBidWNrZXRzVG9EZWxldGUgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyByZWFkb25seSBpbnRlZ1Rlc3REaXI6IHN0cmluZyxcbiAgICBwdWJsaWMgcmVhZG9ubHkgc3RhY2tOYW1lUHJlZml4OiBzdHJpbmcsXG4gICAgcHVibGljIHJlYWRvbmx5IG91dHB1dDogTm9kZUpTLldyaXRhYmxlU3RyZWFtLFxuICAgIHB1YmxpYyByZWFkb25seSBhd3M6IEF3c0NsaWVudHMpIHtcbiAgfVxuXG4gIHB1YmxpYyBsb2coczogc3RyaW5nKSB7XG4gICAgdGhpcy5vdXRwdXQud3JpdGUoYCR7c31cXG5gKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBzaGVsbChjb21tYW5kOiBzdHJpbmdbXSwgb3B0aW9uczogT21pdDxTaGVsbE9wdGlvbnMsICdjd2QnfCdvdXRwdXQnPiA9IHt9KTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gc2hlbGwoY29tbWFuZCwge1xuICAgICAgb3V0cHV0OiB0aGlzLm91dHB1dCxcbiAgICAgIGN3ZDogdGhpcy5pbnRlZ1Rlc3REaXIsXG4gICAgICAuLi5vcHRpb25zLFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGNka0RlcGxveShzdGFja05hbWVzOiBzdHJpbmcgfCBzdHJpbmdbXSwgb3B0aW9uczogQ2RrQ2xpT3B0aW9ucyA9IHt9KSB7XG4gICAgc3RhY2tOYW1lcyA9IHR5cGVvZiBzdGFja05hbWVzID09PSAnc3RyaW5nJyA/IFtzdGFja05hbWVzXSA6IHN0YWNrTmFtZXM7XG5cbiAgICBjb25zdCBuZXZlclJlcXVpcmVBcHByb3ZhbCA9IG9wdGlvbnMubmV2ZXJSZXF1aXJlQXBwcm92YWwgPz8gdHJ1ZTtcblxuICAgIHJldHVybiB0aGlzLmNkayhbJ2RlcGxveScsXG4gICAgICAuLi4obmV2ZXJSZXF1aXJlQXBwcm92YWwgPyBbJy0tcmVxdWlyZS1hcHByb3ZhbD1uZXZlciddIDogW10pLCAvLyBEZWZhdWx0IHRvIG5vIGFwcHJvdmFsIGluIGFuIHVuYXR0ZW5kZWQgdGVzdFxuICAgICAgLi4uKG9wdGlvbnMub3B0aW9ucyA/PyBbXSksXG4gICAgICAuLi50aGlzLmZ1bGxTdGFja05hbWUoc3RhY2tOYW1lcyldLCBvcHRpb25zKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBjZGtEZXN0cm95KHN0YWNrTmFtZXM6IHN0cmluZyB8IHN0cmluZ1tdLCBvcHRpb25zOiBDZGtDbGlPcHRpb25zID0ge30pIHtcbiAgICBzdGFja05hbWVzID0gdHlwZW9mIHN0YWNrTmFtZXMgPT09ICdzdHJpbmcnID8gW3N0YWNrTmFtZXNdIDogc3RhY2tOYW1lcztcblxuICAgIHJldHVybiB0aGlzLmNkayhbJ2Rlc3Ryb3knLFxuICAgICAgJy1mJywgLy8gV2UgbmV2ZXIgd2FudCBhIHByb21wdCBpbiBhbiB1bmF0dGVuZGVkIHRlc3RcbiAgICAgIC4uLihvcHRpb25zLm9wdGlvbnMgPz8gW10pLFxuICAgICAgLi4udGhpcy5mdWxsU3RhY2tOYW1lKHN0YWNrTmFtZXMpXSwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgY2RrKGFyZ3M6IHN0cmluZ1tdLCBvcHRpb25zOiBDZGtDbGlPcHRpb25zID0ge30pIHtcbiAgICBjb25zdCB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlID8/IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcy5zaGVsbChbJ2NkaycsIC4uLih2ZXJib3NlID8gWyctdiddIDogW10pLCAuLi5hcmdzXSwge1xuICAgICAgLi4ub3B0aW9ucyxcbiAgICAgIG1vZEVudjoge1xuICAgICAgICBBV1NfUkVHSU9OOiB0aGlzLmF3cy5yZWdpb24sXG4gICAgICAgIEFXU19ERUZBVUxUX1JFR0lPTjogdGhpcy5hd3MucmVnaW9uLFxuICAgICAgICBTVEFDS19OQU1FX1BSRUZJWDogdGhpcy5zdGFja05hbWVQcmVmaXgsXG4gICAgICAgIC4uLm9wdGlvbnMubW9kRW52LFxuICAgICAgfSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBmdWxsU3RhY2tOYW1lKHN0YWNrTmFtZTogc3RyaW5nKTogc3RyaW5nO1xuICBwdWJsaWMgZnVsbFN0YWNrTmFtZShzdGFja05hbWVzOiBzdHJpbmdbXSk6IHN0cmluZ1tdO1xuICBwdWJsaWMgZnVsbFN0YWNrTmFtZShzdGFja05hbWVzOiBzdHJpbmcgfCBzdHJpbmdbXSk6IHN0cmluZyB8IHN0cmluZ1tdIHtcbiAgICBpZiAodHlwZW9mIHN0YWNrTmFtZXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICByZXR1cm4gYCR7dGhpcy5zdGFja05hbWVQcmVmaXh9LSR7c3RhY2tOYW1lc31gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3RhY2tOYW1lcy5tYXAocyA9PiBgJHt0aGlzLnN0YWNrTmFtZVByZWZpeH0tJHtzfWApO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBBcHBlbmQgdGhpcyB0byB0aGUgbGlzdCBvZiBidWNrZXRzIHRvIHBvdGVudGlhbGx5IGRlbGV0ZVxuICAgKlxuICAgKiBBdCB0aGUgZW5kIG9mIGEgdGVzdCwgd2UgY2xlYW4gdXAgYnVja2V0cyB0aGF0IG1heSBub3QgaGF2ZSBnb3R0ZW4gZGVzdHJveWVkXG4gICAqIChmb3Igd2hhdGV2ZXIgcmVhc29uKS5cbiAgICovXG4gIHB1YmxpYyByZW1lbWJlclRvRGVsZXRlQnVja2V0KGJ1Y2tldE5hbWU6IHN0cmluZykge1xuICAgIHRoaXMuYnVja2V0c1RvRGVsZXRlLnB1c2goYnVja2V0TmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYW51cCBsZWZ0b3ZlciBzdGFja3MgYW5kIGJ1Y2tldHNcbiAgICovXG4gIHB1YmxpYyBhc3luYyBkaXNwb3NlKHN1Y2Nlc3M6IGJvb2xlYW4pIHtcbiAgICBjb25zdCBzdGFja3NUb0RlbGV0ZSA9IGF3YWl0IHRoaXMuZGVsZXRlYWJsZVN0YWNrcyh0aGlzLnN0YWNrTmFtZVByZWZpeCk7XG5cbiAgICAvLyBCb290c3RyYXAgc3RhY2tzIGhhdmUgYnVja2V0cyB0aGF0IG5lZWQgdG8gYmUgY2xlYW5lZFxuICAgIGNvbnN0IGJ1Y2tldE5hbWVzID0gc3RhY2tzVG9EZWxldGUubWFwKHN0YWNrID0+IG91dHB1dEZyb21TdGFjaygnQnVja2V0TmFtZScsIHN0YWNrKSkuZmlsdGVyKGRlZmluZWQpO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKGJ1Y2tldE5hbWVzLm1hcChiID0+IHRoaXMuYXdzLmVtcHR5QnVja2V0KGIpKSk7XG5cbiAgICAvLyBCb290c3RyYXAgc3RhY2tzIGhhdmUgRUNSIHJlcG9zaXRvcmllcyB3aXRoIGltYWdlcyB3aGljaCBzaG91bGQgYmUgZGVsZXRlZFxuICAgIGNvbnN0IGltYWdlUmVwb3NpdG9yeU5hbWVzID0gc3RhY2tzVG9EZWxldGUubWFwKHN0YWNrID0+IG91dHB1dEZyb21TdGFjaygnSW1hZ2VSZXBvc2l0b3J5TmFtZScsIHN0YWNrKSkuZmlsdGVyKGRlZmluZWQpO1xuICAgIGF3YWl0IFByb21pc2UuYWxsKGltYWdlUmVwb3NpdG9yeU5hbWVzLm1hcChyID0+IHRoaXMuYXdzLmRlbGV0ZUltYWdlUmVwb3NpdG9yeShyKSkpO1xuXG4gICAgYXdhaXQgdGhpcy5hd3MuZGVsZXRlU3RhY2tzKC4uLnN0YWNrc1RvRGVsZXRlLm1hcChzID0+IHMuU3RhY2tOYW1lKSk7XG5cbiAgICAvLyBXZSBtaWdodCBoYXZlIGxlYWtlZCBzb21lIGJ1Y2tldHMgYnkgdXBncmFkaW5nIHRoZSBib290c3RyYXAgc3RhY2suIEJlXG4gICAgLy8gc3VyZSB0byBjbGVhbiBldmVyeXRoaW5nLlxuICAgIGZvciAoY29uc3QgYnVja2V0IG9mIHRoaXMuYnVja2V0c1RvRGVsZXRlKSB7XG4gICAgICBhd2FpdCB0aGlzLmF3cy5kZWxldGVCdWNrZXQoYnVja2V0KTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGUgdGVzdHMgY29tcGxldGVkIHN1Y2Nlc3NmdWxseSwgaGFwcGlseSBkZWxldGUgdGhlIGZpeHR1cmVcbiAgICAvLyAob3RoZXJ3aXNlIGxlYXZlIGl0IGZvciBodW1hbnMgdG8gaW5zcGVjdClcbiAgICBpZiAoc3VjY2Vzcykge1xuICAgICAgcmltcmFmKHRoaXMuaW50ZWdUZXN0RGlyKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBzdGFja3Mgc3RhcnRpbmcgd2l0aCBvdXIgdGVzdGluZyBwcmVmaXggdGhhdCBzaG91bGQgYmUgZGVsZXRlZFxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyBkZWxldGVhYmxlU3RhY2tzKHByZWZpeDogc3RyaW5nKTogUHJvbWlzZTxBV1MuQ2xvdWRGb3JtYXRpb24uU3RhY2tbXT4ge1xuICAgIGNvbnN0IHN0YXR1c0ZpbHRlciA9IFtcbiAgICAgICdDUkVBVEVfSU5fUFJPR1JFU1MnLCAnQ1JFQVRFX0ZBSUxFRCcsICdDUkVBVEVfQ09NUExFVEUnLFxuICAgICAgJ1JPTExCQUNLX0lOX1BST0dSRVNTJywgJ1JPTExCQUNLX0ZBSUxFRCcsICdST0xMQkFDS19DT01QTEVURScsXG4gICAgICAnREVMRVRFX0ZBSUxFRCcsXG4gICAgICAnVVBEQVRFX0lOX1BST0dSRVNTJywgJ1VQREFURV9DT01QTEVURV9DTEVBTlVQX0lOX1BST0dSRVNTJyxcbiAgICAgICdVUERBVEVfQ09NUExFVEUnLCAnVVBEQVRFX1JPTExCQUNLX0lOX1BST0dSRVNTJyxcbiAgICAgICdVUERBVEVfUk9MTEJBQ0tfRkFJTEVEJyxcbiAgICAgICdVUERBVEVfUk9MTEJBQ0tfQ09NUExFVEVfQ0xFQU5VUF9JTl9QUk9HUkVTUycsXG4gICAgICAnVVBEQVRFX1JPTExCQUNLX0NPTVBMRVRFJywgJ1JFVklFV19JTl9QUk9HUkVTUycsXG4gICAgICAnSU1QT1JUX0lOX1BST0dSRVNTJywgJ0lNUE9SVF9DT01QTEVURScsXG4gICAgICAnSU1QT1JUX1JPTExCQUNLX0lOX1BST0dSRVNTJywgJ0lNUE9SVF9ST0xMQkFDS19GQUlMRUQnLFxuICAgICAgJ0lNUE9SVF9ST0xMQkFDS19DT01QTEVURScsXG4gICAgXTtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgdGhpcy5hd3MuY2xvdWRGb3JtYXRpb24oJ2Rlc2NyaWJlU3RhY2tzJywge30pO1xuXG4gICAgcmV0dXJuIChyZXNwb25zZS5TdGFja3MgPz8gW10pXG4gICAgICAuZmlsdGVyKHMgPT4gcy5TdGFja05hbWUuc3RhcnRzV2l0aChwcmVmaXgpKVxuICAgICAgLmZpbHRlcihzID0+IHN0YXR1c0ZpbHRlci5pbmNsdWRlcyhzLlN0YWNrU3RhdHVzKSlcbiAgICAgIC5maWx0ZXIocyA9PiBzLlJvb3RJZCA9PT0gdW5kZWZpbmVkKTsgLy8gT25seSBkZWxldGUgcGFyZW50IHN0YWNrcy4gTmVzdGVkIHN0YWNrcyBhcmUgZGVsZXRlZCBpbiB0aGUgcHJvY2Vzc1xuICB9XG59XG5cbi8qKlxuICogUGVyZm9ybSBhIG9uZS10aW1lIHF1aWNrIHNhbml0eSBjaGVjayB0aGF0IHRoZSBBV1MgY2xpZW50cyBoYXMgcHJvcGVybHkgY29uZmlndXJlZCBjcmVkZW50aWFsc1xuICpcbiAqIElmIHdlIGRvbid0IGRvIHRoaXMsIGNhbGxzIGFyZSBnb2luZyB0byBmYWlsIGFuZCB0aGV5J2xsIGJlIHJldHJpZWQgYW5kIGV2ZXJ5dGhpbmcgd2lsbCB0YWtlXG4gKiBmb3JldmVyIGJlZm9yZSB0aGUgdXNlciBub3RpY2VzIGEgc2ltcGxlIG1pc2NvbmZpZ3VyYXRpb24uXG4gKlxuICogV2UgY2FuJ3QgY2hlY2sgZm9yIHRoZSBwcmVzZW5jZSBvZiBlbnZpcm9ubWVudCB2YXJpYWJsZXMgc2luY2UgY3JlZGVudGlhbHMgY291bGQgY29tZSBmcm9tXG4gKiBhbnl3aGVyZSwgc28gZG8gc2ltcGxlIGFjY291bnQgcmV0cmlldmFsLlxuICpcbiAqIE9ubHkgZG8gaXQgb25jZSBwZXIgcHJvY2Vzcy5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gc2FuaXR5Q2hlY2soYXdzOiBBd3NDbGllbnRzKSB7XG4gIGlmIChzYW5pdHlDaGVja2VkID09PSB1bmRlZmluZWQpIHtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgYXdzLmFjY291bnQoKTtcbiAgICAgIHNhbml0eUNoZWNrZWQgPSB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHNhbml0eUNoZWNrZWQgPSBmYWxzZTtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQVdTIGNyZWRlbnRpYWxzIHByb2JhYmx5IG5vdCBjb25maWd1cmVkLCBnb3QgZXJyb3I6ICR7ZS5tZXNzYWdlfWApO1xuICAgIH1cbiAgfVxuICBpZiAoIXNhbml0eUNoZWNrZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FXUyBjcmVkZW50aWFscyBwcm9iYWJseSBub3QgY29uZmlndXJlZCwgc2VlIHByZXZpb3VzIGVycm9yJyk7XG4gIH1cbn1cbmxldCBzYW5pdHlDaGVja2VkOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG4vKipcbiAqIE1ha2Ugc3VyZSB0aGF0IHRoZSBnaXZlbiBlbnZpcm9ubWVudCBpcyBib290c3RyYXBwZWRcbiAqXG4gKiBTaW5jZSB3ZSBnbyBzdHJpcGluZyBhY3Jvc3MgcmVnaW9ucywgaXQncyBnb2luZyB0byBzdWNrIGRvaW5nIHRoaXNcbiAqIGJ5IGhhbmQgc28gbGV0J3MganVzdCBtYXNzLWF1dG9tYXRlIGl0LlxuICovXG5hc3luYyBmdW5jdGlvbiBlbnN1cmVCb290c3RyYXBwZWQoZml4dHVyZTogVGVzdEZpeHR1cmUpIHtcbiAgLy8gT2xkLXN0eWxlIGJvb3RzdHJhcCBzdGFjayB3aXRoIGRlZmF1bHQgbmFtZVxuICBpZiAoYXdhaXQgZml4dHVyZS5hd3Muc3RhY2tTdGF0dXMoJ0NES1Rvb2xraXQnKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgYXdhaXQgZml4dHVyZS5jZGsoWydib290c3RyYXAnLCBgYXdzOi8vJHthd2FpdCBmaXh0dXJlLmF3cy5hY2NvdW50KCl9LyR7Zml4dHVyZS5hd3MucmVnaW9ufWBdKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgc2hlbGwgY29tbWFuZCB0aGF0IGRvZXMgd2hhdCB5b3Ugd2FudFxuICpcbiAqIElzIHBsYXRmb3JtLWF3YXJlLCBoYW5kbGVzIGVycm9ycyBuaWNlbHkuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzaGVsbChjb21tYW5kOiBzdHJpbmdbXSwgb3B0aW9uczogU2hlbGxPcHRpb25zID0ge30pOiBQcm9taXNlPHN0cmluZz4ge1xuICBpZiAob3B0aW9ucy5tb2RFbnYgJiYgb3B0aW9ucy5lbnYpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VzZSBlaXRoZXIgZW52IG9yIG1vZEVudiBidXQgbm90IGJvdGgnKTtcbiAgfVxuXG4gIG9wdGlvbnMub3V0cHV0Py53cml0ZShg8J+SuyAke2NvbW1hbmQuam9pbignICcpfVxcbmApO1xuXG4gIGNvbnN0IGVudiA9IG9wdGlvbnMuZW52ID8/IChvcHRpb25zLm1vZEVudiA/IHsgLi4ucHJvY2Vzcy5lbnYsIC4uLm9wdGlvbnMubW9kRW52IH0gOiB1bmRlZmluZWQpO1xuXG4gIGNvbnN0IGNoaWxkID0gY2hpbGRfcHJvY2Vzcy5zcGF3bihjb21tYW5kWzBdLCBjb21tYW5kLnNsaWNlKDEpLCB7XG4gICAgLi4ub3B0aW9ucyxcbiAgICBlbnYsXG4gICAgLy8gTmVlZCB0aGlzIGZvciBXaW5kb3dzIHdoZXJlIHdlIHdhbnQgLmNtZCBhbmQgLmJhdCB0byBiZSBmb3VuZCBhcyB3ZWxsLlxuICAgIHNoZWxsOiB0cnVlLFxuICAgIHN0ZGlvOiBbJ2lnbm9yZScsICdwaXBlJywgJ3BpcGUnXSxcbiAgfSk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlPHN0cmluZz4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIGNvbnN0IHN0ZG91dCA9IG5ldyBBcnJheTxCdWZmZXI+KCk7XG4gICAgY29uc3Qgc3RkZXJyID0gbmV3IEFycmF5PEJ1ZmZlcj4oKTtcblxuICAgIGNoaWxkLnN0ZG91dCEub24oJ2RhdGEnLCBjaHVuayA9PiB7XG4gICAgICBvcHRpb25zLm91dHB1dD8ud3JpdGUoY2h1bmspO1xuICAgICAgc3Rkb3V0LnB1c2goY2h1bmspO1xuICAgIH0pO1xuXG4gICAgY2hpbGQuc3RkZXJyIS5vbignZGF0YScsIGNodW5rID0+IHtcbiAgICAgIG9wdGlvbnMub3V0cHV0Py53cml0ZShjaHVuayk7XG4gICAgICBpZiAob3B0aW9ucy5jYXB0dXJlU3RkZXJyID8/IHRydWUpIHtcbiAgICAgICAgc3RkZXJyLnB1c2goY2h1bmspO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgY2hpbGQub25jZSgnZXJyb3InLCByZWplY3QpO1xuXG4gICAgY2hpbGQub25jZSgnY2xvc2UnLCBjb2RlID0+IHtcbiAgICAgIGlmIChjb2RlID09PSAwIHx8IG9wdGlvbnMuYWxsb3dFcnJFeGl0KSB7XG4gICAgICAgIHJlc29sdmUoKEJ1ZmZlci5jb25jYXQoc3Rkb3V0KS50b1N0cmluZygndXRmLTgnKSArIEJ1ZmZlci5jb25jYXQoc3RkZXJyKS50b1N0cmluZygndXRmLTgnKSkudHJpbSgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoYCcke2NvbW1hbmQuam9pbignICcpfScgZXhpdGVkIHdpdGggZXJyb3IgY29kZSAke2NvZGV9YCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmaW5lZDxBPih4OiBBKTogeCBpcyBOb25OdWxsYWJsZTxBPiB7XG4gIHJldHVybiB4ICE9PSB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogcm0gLXJmIHJlaW1wbGVtZW50YXRpb24sIGRvbid0IHdhbnQgdG8gZGVwZW5kIG9uIGFuIE5QTSBwYWNrYWdlIGZvciB0aGlzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByaW1yYWYoZnNQYXRoOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBpc0RpciA9IGZzLmxzdGF0U3luYyhmc1BhdGgpLmlzRGlyZWN0b3J5KCk7XG5cbiAgICBpZiAoaXNEaXIpIHtcbiAgICAgIGZvciAoY29uc3QgZmlsZSBvZiBmcy5yZWFkZGlyU3luYyhmc1BhdGgpKSB7XG4gICAgICAgIHJpbXJhZihwYXRoLmpvaW4oZnNQYXRoLCBmaWxlKSk7XG4gICAgICB9XG4gICAgICBmcy5ybWRpclN5bmMoZnNQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZnMudW5saW5rU3luYyhmc1BhdGgpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgIC8vIFdlIHdpbGwgc3Vydml2ZSBFTk9FTlRcbiAgICBpZiAoZS5jb2RlICE9PSAnRU5PRU5UJykgeyB0aHJvdyBlOyB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVN0cmluZygpIHtcbiAgLy8gQ3JhenlcbiAgcmV0dXJuIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnJlcGxhY2UoL1teYS16MC05XSsvZywgJycpO1xufSJdfQ==