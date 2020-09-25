"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
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
            ...(neverRequireApproval ? ['--require-approval=never'] : []),
            ...((_b = options.options) !== null && _b !== void 0 ? _b : []),
            ...this.fullStackName(stackNames)], options);
    }
    async cdkDestroy(stackNames, options = {}) {
        var _a;
        stackNames = typeof stackNames === 'string' ? [stackNames] : stackNames;
        return this.cdk(['destroy',
            '-f',
            ...((_a = options.options) !== null && _a !== void 0 ? _a : []),
            ...this.fullStackName(stackNames)], options);
    }
    async cdk(args, options = {}) {
        if (options.verbose) {
            args.push('-v');
        }
        return this.shell(['cdk', ...args], {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2RrLWhlbHBlcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjZGstaGVscGVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQ0FBK0M7QUFDL0MseUJBQXlCO0FBQ3pCLHlCQUF5QjtBQUN6Qiw2QkFBNkI7QUFDN0IsK0NBQTREO0FBQzVELG1EQUErQztBQUcvQyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLFdBQVc7SUFDckMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7SUFDcEMsQ0FBQyxDQUFDLGFBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxVQUFVLG1DQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLG1DQUFJLFdBQVcsQ0FBQyxDQUFDO0FBRTlFLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGtCQUFrQixPQUFPLElBQUksQ0FBQyxDQUFDO0FBRXBELE1BQU0sV0FBVyxHQUFHLElBQUksNEJBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUs5Qzs7OztHQUlHO0FBQ0gsU0FBZ0IsT0FBTyxDQUF3QixLQUFpRDtJQUM5RixPQUFPLENBQUMsT0FBVSxFQUFFLEVBQUUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRTtRQUN4RCxNQUFNLEdBQUcsR0FBRyxNQUFNLHdCQUFVLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDL0QsTUFBTSxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFdkIsT0FBTyxLQUFLLENBQUMsRUFBRSxHQUFHLE9BQU8sRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQVBELDBCQU9DO0FBRUQ7Ozs7Ozs7R0FPRztBQUNILFNBQWdCLFVBQVUsQ0FBcUMsS0FBOEM7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Q0FBQyxDQUFDO1NBQ3ZCO0tBQ0Y7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNWLHlCQUF5QjtRQUN6QixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO1lBQUUsTUFBTSxDQUFDLENBQUM7U0FBRTtLQUN0QztBQUNILENBQUM7QUFoQkQsd0JBZ0JDO0FBRUQsU0FBZ0IsWUFBWTtJQUMxQixRQUFRO0lBQ1IsT0FBTyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUhELG9DQUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2hpbGRfcHJvY2VzcyBmcm9tICdjaGlsZF9wcm9jZXNzJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcbmltcG9ydCAqIGFzIG9zIGZyb20gJ29zJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBvdXRwdXRGcm9tU3RhY2ssIEF3c0NsaWVudHMgfSBmcm9tICcuL2F3cy1oZWxwZXJzJztcbmltcG9ydCB7IFJlc291cmNlUG9vbCB9IGZyb20gJy4vcmVzb3VyY2UtcG9vbCc7XG5pbXBvcnQgeyBUZXN0Q29udGV4dCB9IGZyb20gJy4vdGVzdC1oZWxwZXJzJztcblxuY29uc3QgUkVHSU9OUyA9IHByb2Nlc3MuZW52LkFXU19SRUdJT05TXG4gID8gcHJvY2Vzcy5lbnYuQVdTX1JFR0lPTlMuc3BsaXQoJywnKVxuICA6IFtwcm9jZXNzLmVudi5BV1NfUkVHSU9OID8/IHByb2Nlc3MuZW52LkFXU19ERUZBVUxUX1JFR0lPTiA/PyAndXMtZWFzdC0xJ107XG5cbnByb2Nlc3Muc3Rkb3V0LndyaXRlKGBVc2luZyByZWdpb25zOiAke1JFR0lPTlN9XFxuYCk7XG5cbmNvbnN0IFJFR0lPTl9QT09MID0gbmV3IFJlc291cmNlUG9vbChSRUdJT05TKTtcblxuXG5leHBvcnQgdHlwZSBBd3NDb250ZXh0ID0geyByZWFkb25seSBhd3M6IEF3c0NsaWVudHMgfTtcblxuLyoqXG4gKiBIaWdoZXIgb3JkZXIgZnVuY3Rpb24gdG8gZXhlY3V0ZSBhIGJsb2NrIHdpdGggYW4gQVdTIGNsaWVudCBzZXR1cFxuICpcbiAqIEFsbG9jYXRlIHRoZSBuZXh0IHJlZ2lvbiBmcm9tIHRoZSBSRUdJT04gcG9vbCBhbmQgZGlzcG9zZSBpdCBhZnRlcndhcmRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aEF3czxBIGV4dGVuZHMgVGVzdENvbnRleHQ+KGJsb2NrOiAoY29udGV4dDogQSAmIEF3c0NvbnRleHQpID0+IFByb21pc2U8dm9pZD4pIHtcbiAgcmV0dXJuIChjb250ZXh0OiBBKSA9PiBSRUdJT05fUE9PTC51c2luZyhhc3luYyAocmVnaW9uKSA9PiB7XG4gICAgY29uc3QgYXdzID0gYXdhaXQgQXdzQ2xpZW50cy5mb3JSZWdpb24ocmVnaW9uLCBjb250ZXh0Lm91dHB1dCk7XG4gICAgYXdhaXQgc2FuaXR5Q2hlY2soYXdzKTtcblxuICAgIHJldHVybiBibG9jayh7IC4uLmNvbnRleHQsIGF3cyB9KTtcbiAgfSk7XG59XG5cbi8qKlxuICogSGlnaGVyIG9yZGVyIGZ1bmN0aW9uIHRvIGV4ZWN1dGUgYSBibG9jayB3aXRoIGEgQ0RLIGFwcCBmaXh0dXJlXG4gKlxuICogUmVxdWlyZXMgYW4gQVdTIGNsaWVudCB0byBiZSBwYXNzZWQgaW4uXG4gKlxuICogRm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHdpdGggZXhpc3RpbmcgdGVzdHMgKHNvIHdlIGRvbid0IGhhdmUgdG8gY2hhbmdlXG4gKiB0b28gbXVjaCkgdGhlIGlubmVyIGJsb2NrIGlzIGV4cGVjdGVkIHRvIHRha2UgYSBgVGVzdEZpeHR1cmVgIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhDZGtBcHA8QSBleHRlbmRzIFRlc3RDb250ZXh0ICYgQXdzQ29udGV4dD4oYmxvY2s6IChjb250ZXh0OiBUZXN0Rml4dHVyZSkgPT4gUHJvbWlzZTx2b2lkPikge1xuICByZXR1cm4gYXN5bmMgKGNvbnRleHQ6IEEpID0+IHtcbiAgICBjb25zdCByYW5keSA9IHJhbmRvbVN0cmluZygpO1xuICAgIGNvbnN0IHN0YWNrTmFtZVByZWZpeCA9IGBjZGt0ZXN0LSR7cmFuZHl9YDtcbiAgICBjb25zdCBpbnRlZ1Rlc3REaXIgPSBwYXRoLmpvaW4ob3MudG1wZGlyKCksIGBjZGstaW50ZWctJHtyYW5keX1gKTtcblxuICAgIGNvbnRleHQub3V0cHV0LndyaXRlKGAgU3RhY2sgcHJlZml4OiAgICR7c3RhY2tOYW1lUHJlZml4fVxcbmApO1xuICAgIGNvbnRleHQub3V0cHV0LndyaXRlKGAgVGVzdCBkaXJlY3Rvcnk6ICR7aW50ZWdUZXN0RGlyfVxcbmApO1xuICAgIGNvbnRleHQub3V0cHV0LndyaXRlKGAgUmVnaW9uOiAgICAgICAgICR7Y29udGV4dC5hd3MucmVnaW9ufVxcbmApO1xuXG4gICAgYXdhaXQgY2xvbmVEaXJlY3RvcnkocGF0aC5qb2luKF9fZGlybmFtZSwgJ2FwcCcpLCBpbnRlZ1Rlc3REaXIsIGNvbnRleHQub3V0cHV0KTtcbiAgICBjb25zdCBmaXh0dXJlID0gbmV3IFRlc3RGaXh0dXJlKFxuICAgICAgaW50ZWdUZXN0RGlyLFxuICAgICAgc3RhY2tOYW1lUHJlZml4LFxuICAgICAgY29udGV4dC5vdXRwdXQsXG4gICAgICBjb250ZXh0LmF3cyk7XG5cbiAgICBsZXQgc3VjY2VzcyA9IHRydWU7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGZpeHR1cmUuc2hlbGwoWyducG0nLCAnaW5zdGFsbCcsXG4gICAgICAgICdAYXdzLWNkay9jb3JlJyxcbiAgICAgICAgJ0Bhd3MtY2RrL2F3cy1zbnMnLFxuICAgICAgICAnQGF3cy1jZGsvYXdzLWlhbScsXG4gICAgICAgICdAYXdzLWNkay9hd3MtbGFtYmRhJyxcbiAgICAgICAgJ0Bhd3MtY2RrL2F3cy1zc20nLFxuICAgICAgICAnQGF3cy1jZGsvYXdzLWVjci1hc3NldHMnLFxuICAgICAgICAnQGF3cy1jZGsvYXdzLWNsb3VkZm9ybWF0aW9uJyxcbiAgICAgICAgJ0Bhd3MtY2RrL2F3cy1lYzInXSk7XG5cbiAgICAgIGF3YWl0IGVuc3VyZUJvb3RzdHJhcHBlZChmaXh0dXJlKTtcblxuICAgICAgYXdhaXQgYmxvY2soZml4dHVyZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc3VjY2VzcyA9IGZhbHNlO1xuICAgICAgdGhyb3cgZTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgYXdhaXQgZml4dHVyZS5kaXNwb3NlKHN1Y2Nlc3MpO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBEZWZhdWx0IHRlc3QgZml4dHVyZSBmb3IgbW9zdCAoYWxsPykgaW50ZWcgdGVzdHNcbiAqXG4gKiBJdCdzIGEgY29tcG9zaXRpb24gb2Ygd2l0aEF3cy93aXRoQ2RrQXBwLCBleHBlY3RpbmcgdGhlIHRlc3QgYmxvY2sgdG8gdGFrZSBhIGBUZXN0Rml4dHVyZWBcbiAqIG9iamVjdC5cbiAqXG4gKiBXZSBjb3VsZCBoYXZlIHB1dCBgd2l0aEF3cyh3aXRoQ2RrQXBwKGZpeHR1cmUgPT4geyAvLi4uIGFjdHVhbCB0ZXN0IGhlcmUuLi4vIH0pKWAgaW4gZXZlcnlcbiAqIHRlc3QgZGVjbGFyYXRpb24gYnV0IGNlbnRyYWxpemluZyBpdCBpcyBnb2luZyB0byBtYWtlIGl0IGNvbnZlbmllbnQgdG8gbW9kaWZ5IGluIHRoZSBmdXR1cmUuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aXRoRGVmYXVsdEZpeHR1cmUoYmxvY2s6IChjb250ZXh0OiBUZXN0Rml4dHVyZSkgPT4gUHJvbWlzZTx2b2lkPikge1xuICByZXR1cm4gd2l0aEF3czxUZXN0Q29udGV4dD4od2l0aENka0FwcChibG9jaykpO1xuICAvLyAgICAgICAgICAgICAgXn5+fn5+IHRoaXMgaXMgZGlzYXBwb2ludGluZyBUeXBlU2NyaXB0ISBGZWVscyBsaWtlIHlvdSBzaG91bGQgaGF2ZSBiZWVuIGFibGUgdG8gZGVyaXZlIHRoaXMuXG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2hlbGxPcHRpb25zIGV4dGVuZHMgY2hpbGRfcHJvY2Vzcy5TcGF3bk9wdGlvbnMge1xuICAvKipcbiAgICogUHJvcGVydGllcyB0byBhZGQgdG8gJ2VudidcbiAgICovXG4gIG1vZEVudj86IFJlY29yZDxzdHJpbmcsIHN0cmluZz47XG5cbiAgLyoqXG4gICAqIERvbid0IGZhaWwgd2hlbiBleGl0aW5nIHdpdGggYW4gZXJyb3JcbiAgICpcbiAgICogQGRlZmF1bHQgZmFsc2VcbiAgICovXG4gIGFsbG93RXJyRXhpdD86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdG8gY2FwdHVyZSBzdGRlcnJcbiAgICpcbiAgICogQGRlZmF1bHQgdHJ1ZVxuICAgKi9cbiAgY2FwdHVyZVN0ZGVycj86IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFBhc3Mgb3V0cHV0IGhlcmVcbiAgICovXG4gIG91dHB1dD86IE5vZGVKUy5Xcml0YWJsZVN0cmVhbTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBDZGtDbGlPcHRpb25zIGV4dGVuZHMgU2hlbGxPcHRpb25zIHtcbiAgb3B0aW9ucz86IHN0cmluZ1tdO1xuICBuZXZlclJlcXVpcmVBcHByb3ZhbD86IGJvb2xlYW47XG4gIHZlcmJvc2U/OiBib29sZWFuO1xufVxuXG4vKipcbiAqIFByZXBhcmUgYSB0YXJnZXQgZGlyIGJ5cmVwbGljYXRpbmcgYSBzb3VyY2UgZGlyZWN0b3J5XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjbG9uZURpcmVjdG9yeShzb3VyY2U6IHN0cmluZywgdGFyZ2V0OiBzdHJpbmcsIG91dHB1dD86IE5vZGVKUy5Xcml0YWJsZVN0cmVhbSkge1xuICBhd2FpdCBzaGVsbChbJ3JtJywgJy1yZicsIHRhcmdldF0sIHsgb3V0cHV0IH0pO1xuICBhd2FpdCBzaGVsbChbJ21rZGlyJywgJy1wJywgdGFyZ2V0XSwgeyBvdXRwdXQgfSk7XG4gIGF3YWl0IHNoZWxsKFsnY3AnLCAnLVInLCBzb3VyY2UgKyAnLyonLCB0YXJnZXRdLCB7IG91dHB1dCB9KTtcbn1cblxuZXhwb3J0IGNsYXNzIFRlc3RGaXh0dXJlIHtcbiAgcHVibGljIHJlYWRvbmx5IHF1YWxpZmllciA9IHJhbmRvbVN0cmluZygpLnN1YnN0cigwLCAxMCk7XG4gIHByaXZhdGUgcmVhZG9ubHkgYnVja2V0c1RvRGVsZXRlID0gbmV3IEFycmF5PHN0cmluZz4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgcmVhZG9ubHkgaW50ZWdUZXN0RGlyOiBzdHJpbmcsXG4gICAgcHVibGljIHJlYWRvbmx5IHN0YWNrTmFtZVByZWZpeDogc3RyaW5nLFxuICAgIHB1YmxpYyByZWFkb25seSBvdXRwdXQ6IE5vZGVKUy5Xcml0YWJsZVN0cmVhbSxcbiAgICBwdWJsaWMgcmVhZG9ubHkgYXdzOiBBd3NDbGllbnRzKSB7XG4gIH1cblxuICBwdWJsaWMgbG9nKHM6IHN0cmluZykge1xuICAgIHRoaXMub3V0cHV0LndyaXRlKGAke3N9XFxuYCk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgc2hlbGwoY29tbWFuZDogc3RyaW5nW10sIG9wdGlvbnM6IE9taXQ8U2hlbGxPcHRpb25zLCAnY3dkJ3wnb3V0cHV0Jz4gPSB7fSk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHNoZWxsKGNvbW1hbmQsIHtcbiAgICAgIG91dHB1dDogdGhpcy5vdXRwdXQsXG4gICAgICBjd2Q6IHRoaXMuaW50ZWdUZXN0RGlyLFxuICAgICAgLi4ub3B0aW9ucyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyBjZGtEZXBsb3koc3RhY2tOYW1lczogc3RyaW5nIHwgc3RyaW5nW10sIG9wdGlvbnM6IENka0NsaU9wdGlvbnMgPSB7fSkge1xuICAgIHN0YWNrTmFtZXMgPSB0eXBlb2Ygc3RhY2tOYW1lcyA9PT0gJ3N0cmluZycgPyBbc3RhY2tOYW1lc10gOiBzdGFja05hbWVzO1xuXG4gICAgY29uc3QgbmV2ZXJSZXF1aXJlQXBwcm92YWwgPSBvcHRpb25zLm5ldmVyUmVxdWlyZUFwcHJvdmFsID8/IHRydWU7XG5cbiAgICByZXR1cm4gdGhpcy5jZGsoWydkZXBsb3knLFxuICAgICAgLi4uKG5ldmVyUmVxdWlyZUFwcHJvdmFsID8gWyctLXJlcXVpcmUtYXBwcm92YWw9bmV2ZXInXSA6IFtdKSwgLy8gRGVmYXVsdCB0byBubyBhcHByb3ZhbCBpbiBhbiB1bmF0dGVuZGVkIHRlc3RcbiAgICAgIC4uLihvcHRpb25zLm9wdGlvbnMgPz8gW10pLFxuICAgICAgLi4udGhpcy5mdWxsU3RhY2tOYW1lKHN0YWNrTmFtZXMpXSwgb3B0aW9ucyk7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgY2RrRGVzdHJveShzdGFja05hbWVzOiBzdHJpbmcgfCBzdHJpbmdbXSwgb3B0aW9uczogQ2RrQ2xpT3B0aW9ucyA9IHt9KSB7XG4gICAgc3RhY2tOYW1lcyA9IHR5cGVvZiBzdGFja05hbWVzID09PSAnc3RyaW5nJyA/IFtzdGFja05hbWVzXSA6IHN0YWNrTmFtZXM7XG5cbiAgICByZXR1cm4gdGhpcy5jZGsoWydkZXN0cm95JyxcbiAgICAgICctZicsIC8vIFdlIG5ldmVyIHdhbnQgYSBwcm9tcHQgaW4gYW4gdW5hdHRlbmRlZCB0ZXN0XG4gICAgICAuLi4ob3B0aW9ucy5vcHRpb25zID8/IFtdKSxcbiAgICAgIC4uLnRoaXMuZnVsbFN0YWNrTmFtZShzdGFja05hbWVzKV0sIG9wdGlvbnMpO1xuICB9XG5cbiAgcHVibGljIGFzeW5jIGNkayhhcmdzOiBzdHJpbmdbXSwgb3B0aW9uczogQ2RrQ2xpT3B0aW9ucyA9IHt9KSB7XG4gICAgaWYgKG9wdGlvbnMudmVyYm9zZSkge1xuICAgICAgYXJncy5wdXNoKCctdicpOyAgICAgICBcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5zaGVsbChbJ2NkaycsIC4uLmFyZ3NdLCB7XG4gICAgICAuLi5vcHRpb25zLFxuICAgICAgbW9kRW52OiB7XG4gICAgICAgIEFXU19SRUdJT046IHRoaXMuYXdzLnJlZ2lvbixcbiAgICAgICAgQVdTX0RFRkFVTFRfUkVHSU9OOiB0aGlzLmF3cy5yZWdpb24sXG4gICAgICAgIFNUQUNLX05BTUVfUFJFRklYOiB0aGlzLnN0YWNrTmFtZVByZWZpeCxcbiAgICAgICAgLi4ub3B0aW9ucy5tb2RFbnYsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGZ1bGxTdGFja05hbWUoc3RhY2tOYW1lOiBzdHJpbmcpOiBzdHJpbmc7XG4gIHB1YmxpYyBmdWxsU3RhY2tOYW1lKHN0YWNrTmFtZXM6IHN0cmluZ1tdKTogc3RyaW5nW107XG4gIHB1YmxpYyBmdWxsU3RhY2tOYW1lKHN0YWNrTmFtZXM6IHN0cmluZyB8IHN0cmluZ1tdKTogc3RyaW5nIHwgc3RyaW5nW10ge1xuICAgIGlmICh0eXBlb2Ygc3RhY2tOYW1lcyA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBgJHt0aGlzLnN0YWNrTmFtZVByZWZpeH0tJHtzdGFja05hbWVzfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzdGFja05hbWVzLm1hcChzID0+IGAke3RoaXMuc3RhY2tOYW1lUHJlZml4fS0ke3N9YCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEFwcGVuZCB0aGlzIHRvIHRoZSBsaXN0IG9mIGJ1Y2tldHMgdG8gcG90ZW50aWFsbHkgZGVsZXRlXG4gICAqXG4gICAqIEF0IHRoZSBlbmQgb2YgYSB0ZXN0LCB3ZSBjbGVhbiB1cCBidWNrZXRzIHRoYXQgbWF5IG5vdCBoYXZlIGdvdHRlbiBkZXN0cm95ZWRcbiAgICogKGZvciB3aGF0ZXZlciByZWFzb24pLlxuICAgKi9cbiAgcHVibGljIHJlbWVtYmVyVG9EZWxldGVCdWNrZXQoYnVja2V0TmFtZTogc3RyaW5nKSB7XG4gICAgdGhpcy5idWNrZXRzVG9EZWxldGUucHVzaChidWNrZXROYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhbnVwIGxlZnRvdmVyIHN0YWNrcyBhbmQgYnVja2V0c1xuICAgKi9cbiAgcHVibGljIGFzeW5jIGRpc3Bvc2Uoc3VjY2VzczogYm9vbGVhbikge1xuICAgIGNvbnN0IHN0YWNrc1RvRGVsZXRlID0gYXdhaXQgdGhpcy5kZWxldGVhYmxlU3RhY2tzKHRoaXMuc3RhY2tOYW1lUHJlZml4KTtcblxuICAgIC8vIEJvb3RzdHJhcCBzdGFja3MgaGF2ZSBidWNrZXRzIHRoYXQgbmVlZCB0byBiZSBjbGVhbmVkXG4gICAgY29uc3QgYnVja2V0TmFtZXMgPSBzdGFja3NUb0RlbGV0ZS5tYXAoc3RhY2sgPT4gb3V0cHV0RnJvbVN0YWNrKCdCdWNrZXROYW1lJywgc3RhY2spKS5maWx0ZXIoZGVmaW5lZCk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoYnVja2V0TmFtZXMubWFwKGIgPT4gdGhpcy5hd3MuZW1wdHlCdWNrZXQoYikpKTtcblxuICAgIC8vIEJvb3RzdHJhcCBzdGFja3MgaGF2ZSBFQ1IgcmVwb3NpdG9yaWVzIHdpdGggaW1hZ2VzIHdoaWNoIHNob3VsZCBiZSBkZWxldGVkXG4gICAgY29uc3QgaW1hZ2VSZXBvc2l0b3J5TmFtZXMgPSBzdGFja3NUb0RlbGV0ZS5tYXAoc3RhY2sgPT4gb3V0cHV0RnJvbVN0YWNrKCdJbWFnZVJlcG9zaXRvcnlOYW1lJywgc3RhY2spKS5maWx0ZXIoZGVmaW5lZCk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoaW1hZ2VSZXBvc2l0b3J5TmFtZXMubWFwKHIgPT4gdGhpcy5hd3MuZGVsZXRlSW1hZ2VSZXBvc2l0b3J5KHIpKSk7XG5cbiAgICBhd2FpdCB0aGlzLmF3cy5kZWxldGVTdGFja3MoLi4uc3RhY2tzVG9EZWxldGUubWFwKHMgPT4gcy5TdGFja05hbWUpKTtcblxuICAgIC8vIFdlIG1pZ2h0IGhhdmUgbGVha2VkIHNvbWUgYnVja2V0cyBieSB1cGdyYWRpbmcgdGhlIGJvb3RzdHJhcCBzdGFjay4gQmVcbiAgICAvLyBzdXJlIHRvIGNsZWFuIGV2ZXJ5dGhpbmcuXG4gICAgZm9yIChjb25zdCBidWNrZXQgb2YgdGhpcy5idWNrZXRzVG9EZWxldGUpIHtcbiAgICAgIGF3YWl0IHRoaXMuYXdzLmRlbGV0ZUJ1Y2tldChidWNrZXQpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZSB0ZXN0cyBjb21wbGV0ZWQgc3VjY2Vzc2Z1bGx5LCBoYXBwaWx5IGRlbGV0ZSB0aGUgZml4dHVyZVxuICAgIC8vIChvdGhlcndpc2UgbGVhdmUgaXQgZm9yIGh1bWFucyB0byBpbnNwZWN0KVxuICAgIGlmIChzdWNjZXNzKSB7XG4gICAgICByaW1yYWYodGhpcy5pbnRlZ1Rlc3REaXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHN0YWNrcyBzdGFydGluZyB3aXRoIG91ciB0ZXN0aW5nIHByZWZpeCB0aGF0IHNob3VsZCBiZSBkZWxldGVkXG4gICAqL1xuICBwcml2YXRlIGFzeW5jIGRlbGV0ZWFibGVTdGFja3MocHJlZml4OiBzdHJpbmcpOiBQcm9taXNlPEFXUy5DbG91ZEZvcm1hdGlvbi5TdGFja1tdPiB7XG4gICAgY29uc3Qgc3RhdHVzRmlsdGVyID0gW1xuICAgICAgJ0NSRUFURV9JTl9QUk9HUkVTUycsICdDUkVBVEVfRkFJTEVEJywgJ0NSRUFURV9DT01QTEVURScsXG4gICAgICAnUk9MTEJBQ0tfSU5fUFJPR1JFU1MnLCAnUk9MTEJBQ0tfRkFJTEVEJywgJ1JPTExCQUNLX0NPTVBMRVRFJyxcbiAgICAgICdERUxFVEVfRkFJTEVEJyxcbiAgICAgICdVUERBVEVfSU5fUFJPR1JFU1MnLCAnVVBEQVRFX0NPTVBMRVRFX0NMRUFOVVBfSU5fUFJPR1JFU1MnLFxuICAgICAgJ1VQREFURV9DT01QTEVURScsICdVUERBVEVfUk9MTEJBQ0tfSU5fUFJPR1JFU1MnLFxuICAgICAgJ1VQREFURV9ST0xMQkFDS19GQUlMRUQnLFxuICAgICAgJ1VQREFURV9ST0xMQkFDS19DT01QTEVURV9DTEVBTlVQX0lOX1BST0dSRVNTJyxcbiAgICAgICdVUERBVEVfUk9MTEJBQ0tfQ09NUExFVEUnLCAnUkVWSUVXX0lOX1BST0dSRVNTJyxcbiAgICAgICdJTVBPUlRfSU5fUFJPR1JFU1MnLCAnSU1QT1JUX0NPTVBMRVRFJyxcbiAgICAgICdJTVBPUlRfUk9MTEJBQ0tfSU5fUFJPR1JFU1MnLCAnSU1QT1JUX1JPTExCQUNLX0ZBSUxFRCcsXG4gICAgICAnSU1QT1JUX1JPTExCQUNLX0NPTVBMRVRFJyxcbiAgICBdO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCB0aGlzLmF3cy5jbG91ZEZvcm1hdGlvbignZGVzY3JpYmVTdGFja3MnLCB7fSk7XG5cbiAgICByZXR1cm4gKHJlc3BvbnNlLlN0YWNrcyA/PyBbXSlcbiAgICAgIC5maWx0ZXIocyA9PiBzLlN0YWNrTmFtZS5zdGFydHNXaXRoKHByZWZpeCkpXG4gICAgICAuZmlsdGVyKHMgPT4gc3RhdHVzRmlsdGVyLmluY2x1ZGVzKHMuU3RhY2tTdGF0dXMpKVxuICAgICAgLmZpbHRlcihzID0+IHMuUm9vdElkID09PSB1bmRlZmluZWQpOyAvLyBPbmx5IGRlbGV0ZSBwYXJlbnQgc3RhY2tzLiBOZXN0ZWQgc3RhY2tzIGFyZSBkZWxldGVkIGluIHRoZSBwcm9jZXNzXG4gIH1cbn1cblxuLyoqXG4gKiBQZXJmb3JtIGEgb25lLXRpbWUgcXVpY2sgc2FuaXR5IGNoZWNrIHRoYXQgdGhlIEFXUyBjbGllbnRzIGhhcyBwcm9wZXJseSBjb25maWd1cmVkIGNyZWRlbnRpYWxzXG4gKlxuICogSWYgd2UgZG9uJ3QgZG8gdGhpcywgY2FsbHMgYXJlIGdvaW5nIHRvIGZhaWwgYW5kIHRoZXknbGwgYmUgcmV0cmllZCBhbmQgZXZlcnl0aGluZyB3aWxsIHRha2VcbiAqIGZvcmV2ZXIgYmVmb3JlIHRoZSB1c2VyIG5vdGljZXMgYSBzaW1wbGUgbWlzY29uZmlndXJhdGlvbi5cbiAqXG4gKiBXZSBjYW4ndCBjaGVjayBmb3IgdGhlIHByZXNlbmNlIG9mIGVudmlyb25tZW50IHZhcmlhYmxlcyBzaW5jZSBjcmVkZW50aWFscyBjb3VsZCBjb21lIGZyb21cbiAqIGFueXdoZXJlLCBzbyBkbyBzaW1wbGUgYWNjb3VudCByZXRyaWV2YWwuXG4gKlxuICogT25seSBkbyBpdCBvbmNlIHBlciBwcm9jZXNzLlxuICovXG5hc3luYyBmdW5jdGlvbiBzYW5pdHlDaGVjayhhd3M6IEF3c0NsaWVudHMpIHtcbiAgaWYgKHNhbml0eUNoZWNrZWQgPT09IHVuZGVmaW5lZCkge1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBhd3MuYWNjb3VudCgpO1xuICAgICAgc2FuaXR5Q2hlY2tlZCA9IHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgc2FuaXR5Q2hlY2tlZCA9IGZhbHNlO1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBV1MgY3JlZGVudGlhbHMgcHJvYmFibHkgbm90IGNvbmZpZ3VyZWQsIGdvdCBlcnJvcjogJHtlLm1lc3NhZ2V9YCk7XG4gICAgfVxuICB9XG4gIGlmICghc2FuaXR5Q2hlY2tlZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQVdTIGNyZWRlbnRpYWxzIHByb2JhYmx5IG5vdCBjb25maWd1cmVkLCBzZWUgcHJldmlvdXMgZXJyb3InKTtcbiAgfVxufVxubGV0IHNhbml0eUNoZWNrZWQ6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbi8qKlxuICogTWFrZSBzdXJlIHRoYXQgdGhlIGdpdmVuIGVudmlyb25tZW50IGlzIGJvb3RzdHJhcHBlZFxuICpcbiAqIFNpbmNlIHdlIGdvIHN0cmlwaW5nIGFjcm9zcyByZWdpb25zLCBpdCdzIGdvaW5nIHRvIHN1Y2sgZG9pbmcgdGhpc1xuICogYnkgaGFuZCBzbyBsZXQncyBqdXN0IG1hc3MtYXV0b21hdGUgaXQuXG4gKi9cbmFzeW5jIGZ1bmN0aW9uIGVuc3VyZUJvb3RzdHJhcHBlZChmaXh0dXJlOiBUZXN0Rml4dHVyZSkge1xuICAvLyBPbGQtc3R5bGUgYm9vdHN0cmFwIHN0YWNrIHdpdGggZGVmYXVsdCBuYW1lXG4gIGlmIChhd2FpdCBmaXh0dXJlLmF3cy5zdGFja1N0YXR1cygnQ0RLVG9vbGtpdCcpID09PSB1bmRlZmluZWQpIHtcbiAgICBhd2FpdCBmaXh0dXJlLmNkayhbJ2Jvb3RzdHJhcCcsIGBhd3M6Ly8ke2F3YWl0IGZpeHR1cmUuYXdzLmFjY291bnQoKX0vJHtmaXh0dXJlLmF3cy5yZWdpb259YF0pO1xuICB9XG59XG5cbi8qKlxuICogQSBzaGVsbCBjb21tYW5kIHRoYXQgZG9lcyB3aGF0IHlvdSB3YW50XG4gKlxuICogSXMgcGxhdGZvcm0tYXdhcmUsIGhhbmRsZXMgZXJyb3JzIG5pY2VseS5cbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNoZWxsKGNvbW1hbmQ6IHN0cmluZ1tdLCBvcHRpb25zOiBTaGVsbE9wdGlvbnMgPSB7fSk6IFByb21pc2U8c3RyaW5nPiB7XG4gIGlmIChvcHRpb25zLm1vZEVudiAmJiBvcHRpb25zLmVudikge1xuICAgIHRocm93IG5ldyBFcnJvcignVXNlIGVpdGhlciBlbnYgb3IgbW9kRW52IGJ1dCBub3QgYm90aCcpO1xuICB9XG5cbiAgb3B0aW9ucy5vdXRwdXQ/LndyaXRlKGDwn5K7ICR7Y29tbWFuZC5qb2luKCcgJyl9XFxuYCk7XG5cbiAgY29uc3QgZW52ID0gb3B0aW9ucy5lbnYgPz8gKG9wdGlvbnMubW9kRW52ID8geyAuLi5wcm9jZXNzLmVudiwgLi4ub3B0aW9ucy5tb2RFbnYgfSA6IHVuZGVmaW5lZCk7XG5cbiAgY29uc3QgY2hpbGQgPSBjaGlsZF9wcm9jZXNzLnNwYXduKGNvbW1hbmRbMF0sIGNvbW1hbmQuc2xpY2UoMSksIHtcbiAgICAuLi5vcHRpb25zLFxuICAgIGVudixcbiAgICAvLyBOZWVkIHRoaXMgZm9yIFdpbmRvd3Mgd2hlcmUgd2Ugd2FudCAuY21kIGFuZCAuYmF0IHRvIGJlIGZvdW5kIGFzIHdlbGwuXG4gICAgc2hlbGw6IHRydWUsXG4gICAgc3RkaW86IFsnaWdub3JlJywgJ3BpcGUnLCAncGlwZSddLFxuICB9KTtcblxuICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgY29uc3Qgc3Rkb3V0ID0gbmV3IEFycmF5PEJ1ZmZlcj4oKTtcbiAgICBjb25zdCBzdGRlcnIgPSBuZXcgQXJyYXk8QnVmZmVyPigpO1xuXG4gICAgY2hpbGQuc3Rkb3V0IS5vbignZGF0YScsIGNodW5rID0+IHtcbiAgICAgIG9wdGlvbnMub3V0cHV0Py53cml0ZShjaHVuayk7XG4gICAgICBzdGRvdXQucHVzaChjaHVuayk7XG4gICAgfSk7XG5cbiAgICBjaGlsZC5zdGRlcnIhLm9uKCdkYXRhJywgY2h1bmsgPT4ge1xuICAgICAgb3B0aW9ucy5vdXRwdXQ/LndyaXRlKGNodW5rKTtcbiAgICAgIGlmIChvcHRpb25zLmNhcHR1cmVTdGRlcnIgPz8gdHJ1ZSkge1xuICAgICAgICBzdGRlcnIucHVzaChjaHVuayk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjaGlsZC5vbmNlKCdlcnJvcicsIHJlamVjdCk7XG5cbiAgICBjaGlsZC5vbmNlKCdjbG9zZScsIGNvZGUgPT4ge1xuICAgICAgaWYgKGNvZGUgPT09IDAgfHwgb3B0aW9ucy5hbGxvd0VyckV4aXQpIHtcbiAgICAgICAgcmVzb2x2ZSgoQnVmZmVyLmNvbmNhdChzdGRvdXQpLnRvU3RyaW5nKCd1dGYtOCcpICsgQnVmZmVyLmNvbmNhdChzdGRlcnIpLnRvU3RyaW5nKCd1dGYtOCcpKS50cmltKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVqZWN0KG5ldyBFcnJvcihgJyR7Y29tbWFuZC5qb2luKCcgJyl9JyBleGl0ZWQgd2l0aCBlcnJvciBjb2RlICR7Y29kZX1gKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkZWZpbmVkPEE+KHg6IEEpOiB4IGlzIE5vbk51bGxhYmxlPEE+IHtcbiAgcmV0dXJuIHggIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBybSAtcmYgcmVpbXBsZW1lbnRhdGlvbiwgZG9uJ3Qgd2FudCB0byBkZXBlbmQgb24gYW4gTlBNIHBhY2thZ2UgZm9yIHRoaXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJpbXJhZihmc1BhdGg6IHN0cmluZykge1xuICB0cnkge1xuICAgIGNvbnN0IGlzRGlyID0gZnMubHN0YXRTeW5jKGZzUGF0aCkuaXNEaXJlY3RvcnkoKTtcblxuICAgIGlmIChpc0Rpcikge1xuICAgICAgZm9yIChjb25zdCBmaWxlIG9mIGZzLnJlYWRkaXJTeW5jKGZzUGF0aCkpIHtcbiAgICAgICAgcmltcmFmKHBhdGguam9pbihmc1BhdGgsIGZpbGUpKTtcbiAgICAgIH1cbiAgICAgIGZzLnJtZGlyU3luYyhmc1BhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmcy51bmxpbmtTeW5jKGZzUGF0aCk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgLy8gV2Ugd2lsbCBzdXJ2aXZlIEVOT0VOVFxuICAgIGlmIChlLmNvZGUgIT09ICdFTk9FTlQnKSB7IHRocm93IGU7IH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9tU3RyaW5nKCkge1xuICAvLyBDcmF6eVxuICByZXR1cm4gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikucmVwbGFjZSgvW15hLXowLTldKy9nLCAnJyk7XG59Il19