"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_SYNTH_OPTIONS = exports.IntegrationTest = exports.IntegrationTests = void 0;
// Helper functions for integration tests
const child_process_1 = require("child_process");
const path = require("path");
const cx_api_1 = require("@aws-cdk/cx-api");
const fs = require("fs-extra");
const lib_1 = require("../../../packages/@aws-cdk/cx-api/lib");
const CDK_OUTDIR = 'cdk-integ.out';
const CDK_INTEG_STACK_PRAGMA = '/// !cdk-integ';
const PRAGMA_PREFIX = 'pragma:';
class IntegrationTests {
    constructor(directory) {
        this.directory = directory;
    }
    async fromCliArgs(tests) {
        let allTests = await this.discover();
        const all = allTests.map(x => x.name);
        let foundAll = true;
        if (tests && tests.length > 0) {
            // Pare down found tests to filter
            allTests = allTests.filter(t => tests.includes(t.name));
            const selectedNames = allTests.map(t => t.name);
            for (const unmatched of tests.filter(t => !selectedNames.includes(t))) {
                process.stderr.write(`No such integ test: ${unmatched}\n`);
                foundAll = false;
            }
        }
        if (!foundAll) {
            process.stderr.write(`Available tests: ${all.join(' ')}\n`);
            return [];
        }
        return allTests;
    }
    async discover() {
        const files = await this.readTree();
        const integs = files.filter(fileName => path.basename(fileName).startsWith('integ.') && path.basename(fileName).endsWith('.js'));
        return await this.request(integs);
    }
    async request(files) {
        return files.map(fileName => new IntegrationTest(this.directory, fileName));
    }
    async readTree() {
        const ret = new Array();
        const rootDir = this.directory;
        async function recurse(dir) {
            const files = await fs.readdir(dir);
            for (const file of files) {
                const fullPath = path.join(dir, file);
                const statf = await fs.stat(fullPath);
                if (statf.isFile()) {
                    ret.push(fullPath.substr(rootDir.length + 1));
                }
                if (statf.isDirectory()) {
                    await recurse(path.join(fullPath));
                }
            }
        }
        await recurse(this.directory);
        return ret;
    }
}
exports.IntegrationTests = IntegrationTests;
class IntegrationTest {
    constructor(directory, name) {
        this.directory = directory;
        this.name = name;
        const baseName = this.name.endsWith('.js') ? this.name.substr(0, this.name.length - 3) : this.name;
        this.expectedFileName = baseName + '.expected.json';
        this.expectedFilePath = path.join(this.directory, this.expectedFileName);
        this.sourceFilePath = path.join(this.directory, this.name);
        this.cdkContextPath = path.join(this.directory, 'cdk.context.json');
    }
    /**
     * Do a CDK synth, mimicking the CLI (without actually using it)
     *
     * The CLI has a pretty slow startup time because of all the modules it needs to load,
     * and we are running this in a tight loop. Bypass it to be quicker!
     *
     * Return the "main" template or a concatenation of all listed templates in the pragma
     */
    async cdkSynthFast(options = {}) {
        var _a;
        const context = {
            ...options.context,
        };
        try {
            await exec(['node', `${this.name}`], {
                cwd: this.directory,
                env: {
                    ...options.env,
                    CDK_CONTEXT_JSON: JSON.stringify(context),
                    CDK_DEFAULT_ACCOUNT: '12345678',
                    CDK_DEFAULT_REGION: 'test-region',
                    CDK_OUTDIR,
                    CDK_CLI_ASM_VERSION: '5.0.0',
                },
            });
            // Interpret the cloud assembly directly here. Not great, but I'm wary
            // adding dependencies on the libraries that model it.
            //
            // FIXME: Refactor later if it doesn't introduce dependency cycles
            const cloudManifest = await fs.readJSON(path.resolve(this.directory, CDK_OUTDIR, 'manifest.json'));
            const stacks = {};
            for (const [artifactId, artifact] of Object.entries((_a = cloudManifest.artifacts) !== null && _a !== void 0 ? _a : {})) {
                if (artifact.type !== 'aws:cloudformation:stack') {
                    continue;
                }
                const template = await fs.readJSON(path.resolve(this.directory, CDK_OUTDIR, artifact.properties.templateFile));
                stacks[artifactId] = template;
            }
            const stacksToDiff = await this.readStackPragma();
            if (stacksToDiff.length > 0) {
                // This is a monster. I'm sorry. :(
                const templates = stacksToDiff.length === 1 && stacksToDiff[0] === '*'
                    ? Object.values(stacks)
                    : stacksToDiff.map(templateForStackName);
                // We're supposed to just return *a* template (which is an object), but there's a crazy
                // case in which we diff multiple templates at once and then they're an array. And it works somehow.
                return templates.length === 1 ? templates[0] : templates;
            }
            else {
                const names = Object.keys(stacks);
                if (names.length !== 1) {
                    throw new Error('"cdk-integ" can only operate on apps with a single stack.\n\n' +
                        '  If your app has multiple stacks, specify which stack to select by adding this to your test source:\n\n' +
                        `      ${CDK_INTEG_STACK_PRAGMA} STACK ...\n\n` +
                        `  Available stacks: ${names.join(' ')} (wildcards are also supported)\n`);
                }
                return stacks[names[0]];
            }
            function templateForStackName(name) {
                if (!stacks[name]) {
                    throw new Error(`No such stack in output: ${name}`);
                }
                return stacks[name];
            }
        }
        finally {
            this.cleanupTemporaryFiles();
        }
    }
    /**
     * Invoke the CDK CLI with some options
     */
    async invokeCli(args, options = {}) {
        // Write context to cdk.json, afterwards delete. We need to do this because there is no way
        // to pass structured context data from the command-line, currently.
        if (options.context) {
            await this.writeCdkContext(options.context);
        }
        else {
            this.cleanupTemporaryFiles();
        }
        const cliSwitches = [
            // This would otherwise trip on every version update
            '--no-version-reporting',
            // don't inject cloudformation metadata into template
            '--no-path-metadata',
            '--no-asset-metadata',
            // save a copy step by not staging assets
            '--no-staging',
            // Different output directory
            '-o', CDK_OUTDIR,
        ];
        try {
            const cdk = require.resolve('aws-cdk/bin/cdk');
            return exec([cdk, '-a', `node ${this.name}`, ...cliSwitches, ...args], {
                cwd: this.directory,
                json: options.json,
                verbose: options.verbose,
                env: options.env,
            });
        }
        finally {
            this.cleanupTemporaryFiles();
        }
    }
    hasExpected() {
        return fs.existsSync(this.expectedFilePath);
    }
    /**
     * Returns the single test stack to use.
     *
     * If the test has a single stack, it will be chosen. Otherwise a pragma is expected within the
     * test file the name of the stack:
     *
     * @example
     *
     *    /// !cdk-integ <stack-name>
     *
     */
    async determineTestStack() {
        const pragma = (await this.readStackPragma());
        if (pragma.length > 0) {
            return pragma;
        }
        const stacks = (await this.invokeCli(['ls'], { ...exports.DEFAULT_SYNTH_OPTIONS })).split('\n');
        if (stacks.length !== 1) {
            throw new Error('"cdk-integ" can only operate on apps with a single stack.\n\n' +
                '  If your app has multiple stacks, specify which stack to select by adding this to your test source:\n\n' +
                `      ${CDK_INTEG_STACK_PRAGMA} STACK ...\n\n` +
                `  Available stacks: ${stacks.join(' ')} (wildcards are also supported)\n`);
        }
        return stacks;
    }
    async readExpected() {
        return JSON.parse(await fs.readFile(this.expectedFilePath, { encoding: 'utf-8' }));
    }
    async writeExpected(actual) {
        await fs.writeFile(this.expectedFilePath, JSON.stringify(actual, undefined, 2), { encoding: 'utf-8' });
    }
    /**
     * Return the non-stack pragmas
     *
     * These are all pragmas that start with "pragma:".
     *
     * For backwards compatibility reasons, all pragmas that DON'T start with this
     * string are considered to be stack names.
     */
    async pragmas() {
        return (await this.readIntegPragma()).filter(p => p.startsWith(PRAGMA_PREFIX));
    }
    async writeCdkContext(config) {
        await fs.writeFile(this.cdkContextPath, JSON.stringify(config, undefined, 2), { encoding: 'utf-8' });
    }
    cleanupTemporaryFiles() {
        if (fs.existsSync(this.cdkContextPath)) {
            fs.unlinkSync(this.cdkContextPath);
        }
        const cdkOutPath = path.join(this.directory, CDK_OUTDIR);
        if (fs.existsSync(cdkOutPath)) {
            fs.removeSync(cdkOutPath);
        }
    }
    /**
     * Reads stack names from the "!cdk-integ" pragma.
     *
     * Every word that's NOT prefixed by "pragma:" is considered a stack name.
     *
     * @example
     *
     *    /// !cdk-integ <stack-name>
     */
    async readStackPragma() {
        return (await this.readIntegPragma()).filter(p => !p.startsWith(PRAGMA_PREFIX));
    }
    /**
     * Read arbitrary cdk-integ pragma directives
     *
     * Reads the test source file and looks for the "!cdk-integ" pragma. If it exists, returns it's
     * contents. This allows integ tests to supply custom command line arguments to "cdk deploy" and "cdk synth".
     *
     * @example
     *
     *    /// !cdk-integ [...]
     */
    async readIntegPragma() {
        const source = await fs.readFile(this.sourceFilePath, { encoding: 'utf-8' });
        const pragmaLine = source.split('\n').find(x => x.startsWith(CDK_INTEG_STACK_PRAGMA + ' '));
        if (!pragmaLine) {
            return [];
        }
        const args = pragmaLine.substring(CDK_INTEG_STACK_PRAGMA.length).trim().split(' ');
        if (args.length === 0) {
            throw new Error(`Invalid syntax for cdk-integ pragma. Usage: "${CDK_INTEG_STACK_PRAGMA} [STACK] [pragma:PRAGMA] [...]"`);
        }
        return args;
    }
}
exports.IntegrationTest = IntegrationTest;
// Default context we run all integ tests with, so they don't depend on the
// account of the exercising user.
exports.DEFAULT_SYNTH_OPTIONS = {
    context: {
        [lib_1.AVAILABILITY_ZONE_FALLBACK_CONTEXT_KEY]: ['test-region-1a', 'test-region-1b', 'test-region-1c'],
        'availability-zones:account=12345678:region=test-region': ['test-region-1a', 'test-region-1b', 'test-region-1c'],
        'ssm:account=12345678:parameterName=/aws/service/ami-amazon-linux-latest/amzn-ami-hvm-x86_64-gp2:region=test-region': 'ami-1234',
        'ssm:account=12345678:parameterName=/aws/service/ami-amazon-linux-latest/amzn2-ami-hvm-x86_64-gp2:region=test-region': 'ami-1234',
        'ssm:account=12345678:parameterName=/aws/service/ecs/optimized-ami/amazon-linux/recommended:region=test-region': '{"image_id": "ami-1234"}',
        // eslint-disable-next-line max-len
        'ami:account=12345678:filters.image-type.0=machine:filters.name.0=amzn-ami-vpc-nat-*:filters.state.0=available:owners.0=amazon:region=test-region': 'ami-1234',
        'vpc-provider:account=12345678:filter.isDefault=true:region=test-region:returnAsymmetricSubnets=true': {
            vpcId: 'vpc-60900905',
            subnetGroups: [
                {
                    type: 'Public',
                    name: 'Public',
                    subnets: [
                        {
                            subnetId: 'subnet-e19455ca',
                            availabilityZone: 'us-east-1a',
                            routeTableId: 'rtb-e19455ca',
                        },
                        {
                            subnetId: 'subnet-e0c24797',
                            availabilityZone: 'us-east-1b',
                            routeTableId: 'rtb-e0c24797',
                        },
                        {
                            subnetId: 'subnet-ccd77395',
                            availabilityZone: 'us-east-1c',
                            routeTableId: 'rtb-ccd77395',
                        },
                    ],
                },
            ],
        },
        // Enable feature flags for all integ tests
        ...cx_api_1.FUTURE_FLAGS,
    },
    env: {
        CDK_INTEG_ACCOUNT: '12345678',
        CDK_INTEG_REGION: 'test-region',
    },
};
/**
 * Our own execute function which doesn't use shells and strings.
 */
function exec(commandLine, options = {}) {
    const proc = child_process_1.spawnSync(commandLine[0], commandLine.slice(1), {
        stdio: ['ignore', 'pipe', options.verbose ? 'inherit' : 'pipe'],
        env: {
            ...process.env,
            CDK_INTEG_MODE: '1',
            ...options.env,
        },
        cwd: options.cwd,
    });
    if (proc.error) {
        throw proc.error;
    }
    if (proc.status !== 0) {
        if (process.stderr) { // will be 'null' in verbose mode
            process.stderr.write(proc.stderr);
        }
        throw new Error(`Command exited with ${proc.status ? `status ${proc.status}` : `signal ${proc.signal}`}`);
    }
    const output = proc.stdout.toString('utf-8').trim();
    try {
        if (options.json) {
            if (output.length === 0) {
                return {};
            }
            return JSON.parse(output);
        }
        return output;
    }
    catch (e) {
        // eslint-disable-next-line no-console
        console.error('Not JSON: ' + output);
        throw new Error('Command output is not JSON');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZWctaGVscGVycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludGVnLWhlbHBlcnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUNBQXlDO0FBQ3pDLGlEQUEwQztBQUMxQyw2QkFBNkI7QUFDN0IsNENBQStDO0FBQy9DLCtCQUErQjtBQUMvQiwrREFBK0Y7QUFFL0YsTUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFDO0FBRW5DLE1BQU0sc0JBQXNCLEdBQUcsZ0JBQWdCLENBQUM7QUFDaEQsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDO0FBRWhDLE1BQWEsZ0JBQWdCO0lBQzNCLFlBQTZCLFNBQWlCO1FBQWpCLGNBQVMsR0FBVCxTQUFTLENBQVE7SUFDOUMsQ0FBQztJQUVNLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBZ0I7UUFDdkMsSUFBSSxRQUFRLEdBQUcsTUFBTSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDckMsTUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFFcEIsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDN0Isa0NBQWtDO1lBQ2xDLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUV4RCxNQUFNLGFBQWEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ2hELEtBQUssTUFBTSxTQUFTLElBQUksS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsYUFBYSxDQUFDLFFBQVEs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SSxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztLQUMvQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBIZWxwZXIgZnVuY3Rpb25zIGZvciBpbnRlZ3JhdGlvbiB0ZXN0c1xuaW1wb3J0IHsgc3Bhd25TeW5jIH0gZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHsgRlVUVVJFX0ZMQUdTIH0gZnJvbSAnQGF3cy1jZGsvY3gtYXBpJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCB7IEFWQUlMQUJJTElUWV9aT05FX0ZBTExCQUNLX0NPTlRFWFRfS0VZIH0gZnJvbSAnLi4vLi4vLi4vcGFja2FnZXMvQGF3cy1jZGsvY3gtYXBpL2xpYic7XG5cbmNvbnN0IENES19PVVRESVIgPSAnY2RrLWludGVnLm91dCc7XG5cbmNvbnN0IENES19JTlRFR19TVEFDS19QUkFHTUEgPSAnLy8vICFjZGstaW50ZWcnO1xuY29uc3QgUFJBR01BX1BSRUZJWCA9ICdwcmFnbWE6JztcblxuZXhwb3J0IGNsYXNzIEludGVncmF0aW9uVGVzdHMge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlYWRvbmx5IGRpcmVjdG9yeTogc3RyaW5nKSB7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZnJvbUNsaUFyZ3ModGVzdHM/OiBzdHJpbmdbXSk6IFByb21pc2U8SW50ZWdyYXRpb25UZXN0W10+IHtcbiAgICBsZXQgYWxsVGVzdHMgPSBhd2FpdCB0aGlzLmRpc2NvdmVyKCk7XG4gICAgY29uc3QgYWxsID0gYWxsVGVzdHMubWFwKHggPT4geC5uYW1lKTtcbiAgICBsZXQgZm91bmRBbGwgPSB0cnVlO1xuXG4gICAgaWYgKHRlc3RzICYmIHRlc3RzLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vIFBhcmUgZG93biBmb3VuZCB0ZXN0cyB0byBmaWx0ZXJcbiAgICAgIGFsbFRlc3RzID0gYWxsVGVzdHMuZmlsdGVyKHQgPT4gdGVzdHMuaW5jbHVkZXModC5uYW1lKSk7XG5cbiAgICAgIGNvbnN0IHNlbGVjdGVkTmFtZXMgPSBhbGxUZXN0cy5tYXAodCA9PiB0Lm5hbWUpO1xuICAgICAgZm9yIChjb25zdCB1bm1hdGNoZWQgb2YgdGVzdHMuZmlsdGVyKHQgPT4gIXNlbGVjdGVkTmFtZXMuaW5jbHVkZXModCkpKSB7XG4gICAgICAgIHByb2Nlc3Muc3RkZXJyLndyaXRlKGBObyBzdWNoIGludGVnIHRlc3Q6ICR7dW5tYXRjaGVkfVxcbmApO1xuICAgICAgICBmb3VuZEFsbCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICghZm91bmRBbGwpIHtcbiAgICAgIHByb2Nlc3Muc3RkZXJyLndyaXRlKGBBdmFpbGFibGUgdGVzdHM6ICR7YWxsLmpvaW4oJyAnKX1cXG5gKTtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gYWxsVGVzdHM7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgZGlzY292ZXIoKTogUHJvbWlzZTxJbnRlZ3JhdGlvblRlc3RbXT4ge1xuICAgIGNvbnN0IGZpbGVzID0gYXdhaXQgdGhpcy5yZWFkVHJlZSgpO1xuICAgIGNvbnN0IGludGVncyA9IGZpbGVzLmZpbHRlcihmaWxlTmFtZSA9PiBwYXRoLmJhc2VuYW1lKGZpbGVOYW1lKS5zdGFydHNXaXRoKCdpbnRlZy4nKSAmJiBwYXRoLmJhc2VuYW1lKGZpbGVOYW1lKS5lbmRzV2l0aCgnLmpzJykpO1xuICAgIHJldHVybiBhd2FpdCB0aGlzLnJlcXVlc3QoaW50ZWdzKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyByZXF1ZXN0KGZpbGVzOiBzdHJpbmdbXSk6IFByb21pc2U8SW50ZWdyYXRpb25UZXN0W10+IHtcbiAgICByZXR1cm4gZmlsZXMubWFwKGZpbGVOYW1lID0+IG5ldyBJbnRlZ3JhdGlvblRlc3QodGhpcy5kaXJlY3RvcnksIGZpbGVOYW1lKSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHJlYWRUcmVlKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCByZXQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xuXG4gICAgY29uc3Qgcm9vdERpciA9IHRoaXMuZGlyZWN0b3J5O1xuXG4gICAgYXN5bmMgZnVuY3Rpb24gcmVjdXJzZShkaXI6IHN0cmluZykge1xuICAgICAgY29uc3QgZmlsZXMgPSBhd2FpdCBmcy5yZWFkZGlyKGRpcik7XG4gICAgICBmb3IgKGNvbnN0IGZpbGUgb2YgZmlsZXMpIHtcbiAgICAgICAgY29uc3QgZnVsbFBhdGggPSBwYXRoLmpvaW4oZGlyLCBmaWxlKTtcbiAgICAgICAgY29uc3Qgc3RhdGYgPSBhd2FpdCBmcy5zdGF0KGZ1bGxQYXRoKTtcbiAgICAgICAgaWYgKHN0YXRmLmlzRmlsZSgpKSB7IHJldC5wdXNoKGZ1bGxQYXRoLnN1YnN0cihyb290RGlyLmxlbmd0aCArIDEpKTsgfVxuICAgICAgICBpZiAoc3RhdGYuaXNEaXJlY3RvcnkoKSkgeyBhd2FpdCByZWN1cnNlKHBhdGguam9pbihmdWxsUGF0aCkpOyB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgYXdhaXQgcmVjdXJzZSh0aGlzLmRpcmVjdG9yeSk7XG4gICAgcmV0dXJuIHJldDtcbiAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN5bnRoT3B0aW9ucyB7XG4gIHJlYWRvbmx5IGNvbnRleHQ/OiBSZWNvcmQ8c3RyaW5nLCBhbnk+O1xuICByZWFkb25seSBlbnY/OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xufVxuXG5leHBvcnQgY2xhc3MgSW50ZWdyYXRpb25UZXN0IHtcbiAgcHVibGljIHJlYWRvbmx5IGV4cGVjdGVkRmlsZU5hbWU6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBleHBlY3RlZEZpbGVQYXRoOiBzdHJpbmc7XG4gIHByaXZhdGUgcmVhZG9ubHkgY2RrQ29udGV4dFBhdGg6IHN0cmluZztcbiAgcHJpdmF0ZSByZWFkb25seSBzb3VyY2VGaWxlUGF0aDogc3RyaW5nO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcmVhZG9ubHkgZGlyZWN0b3J5OiBzdHJpbmcsIHB1YmxpYyByZWFkb25seSBuYW1lOiBzdHJpbmcpIHtcbiAgICBjb25zdCBiYXNlTmFtZSA9IHRoaXMubmFtZS5lbmRzV2l0aCgnLmpzJykgPyB0aGlzLm5hbWUuc3Vic3RyKDAsIHRoaXMubmFtZS5sZW5ndGggLSAzKSA6IHRoaXMubmFtZTtcbiAgICB0aGlzLmV4cGVjdGVkRmlsZU5hbWUgPSBiYXNlTmFtZSArICcuZXhwZWN0ZWQuanNvbic7XG4gICAgdGhpcy5leHBlY3RlZEZpbGVQYXRoID0gcGF0aC5qb2luKHRoaXMuZGlyZWN0b3J5LCB0aGlzLmV4cGVjdGVkRmlsZU5hbWUpO1xuICAgIHRoaXMuc291cmNlRmlsZVBhdGggPSBwYXRoLmpvaW4odGhpcy5kaXJlY3RvcnksIHRoaXMubmFtZSk7XG4gICAgdGhpcy5jZGtDb250ZXh0UGF0aCA9IHBhdGguam9pbih0aGlzLmRpcmVjdG9yeSwgJ2Nkay5jb250ZXh0Lmpzb24nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEbyBhIENESyBzeW50aCwgbWltaWNraW5nIHRoZSBDTEkgKHdpdGhvdXQgYWN0dWFsbHkgdXNpbmcgaXQpXG4gICAqXG4gICAqIFRoZSBDTEkgaGFzIGEgcHJldHR5IHNsb3cgc3RhcnR1cCB0aW1lIGJlY2F1c2Ugb2YgYWxsIHRoZSBtb2R1bGVzIGl0IG5lZWRzIHRvIGxvYWQsXG4gICAqIGFuZCB3ZSBhcmUgcnVubmluZyB0aGlzIGluIGEgdGlnaHQgbG9vcC4gQnlwYXNzIGl0IHRvIGJlIHF1aWNrZXIhXG4gICAqXG4gICAqIFJldHVybiB0aGUgXCJtYWluXCIgdGVtcGxhdGUgb3IgYSBjb25jYXRlbmF0aW9uIG9mIGFsbCBsaXN0ZWQgdGVtcGxhdGVzIGluIHRoZSBwcmFnbWFcbiAgICovXG4gIHB1YmxpYyBhc3luYyBjZGtTeW50aEZhc3Qob3B0aW9uczogU3ludGhPcHRpb25zID0ge30pOiBQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IGNvbnRleHQgPSB7XG4gICAgICAuLi5vcHRpb25zLmNvbnRleHQsXG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBhd2FpdCBleGVjKFsnbm9kZScsIGAke3RoaXMubmFtZX1gXSwge1xuICAgICAgICBjd2Q6IHRoaXMuZGlyZWN0b3J5LFxuICAgICAgICBlbnY6IHtcbiAgICAgICAgICAuLi5vcHRpb25zLmVudixcbiAgICAgICAgICBDREtfQ09OVEVYVF9KU09OOiBKU09OLnN0cmluZ2lmeShjb250ZXh0KSxcbiAgICAgICAgICBDREtfREVGQVVMVF9BQ0NPVU5UOiAnMTIzNDU2NzgnLFxuICAgICAgICAgIENES19ERUZBVUxUX1JFR0lPTjogJ3Rlc3QtcmVnaW9uJyxcbiAgICAgICAgICBDREtfT1VURElSLFxuICAgICAgICAgIENES19DTElfQVNNX1ZFUlNJT046ICc1LjAuMCcsXG4gICAgICAgIH0sXG4gICAgICB9KTtcblxuICAgICAgLy8gSW50ZXJwcmV0IHRoZSBjbG91ZCBhc3NlbWJseSBkaXJlY3RseSBoZXJlLiBOb3QgZ3JlYXQsIGJ1dCBJJ20gd2FyeVxuICAgICAgLy8gYWRkaW5nIGRlcGVuZGVuY2llcyBvbiB0aGUgbGlicmFyaWVzIHRoYXQgbW9kZWwgaXQuXG4gICAgICAvL1xuICAgICAgLy8gRklYTUU6IFJlZmFjdG9yIGxhdGVyIGlmIGl0IGRvZXNuJ3QgaW50cm9kdWNlIGRlcGVuZGVuY3kgY3ljbGVzXG4gICAgICBjb25zdCBjbG91ZE1hbmlmZXN0ID0gYXdhaXQgZnMucmVhZEpTT04ocGF0aC5yZXNvbHZlKHRoaXMuZGlyZWN0b3J5LCBDREtfT1VURElSLCAnbWFuaWZlc3QuanNvbicpKTtcbiAgICAgIGNvbnN0IHN0YWNrczogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9O1xuICAgICAgZm9yIChjb25zdCBbYXJ0aWZhY3RJZCwgYXJ0aWZhY3RdIG9mIE9iamVjdC5lbnRyaWVzKGNsb3VkTWFuaWZlc3QuYXJ0aWZhY3RzID8/IHt9KSBhcyBBcnJheTxbc3RyaW5nLCBhbnldPikge1xuICAgICAgICBpZiAoYXJ0aWZhY3QudHlwZSAhPT0gJ2F3czpjbG91ZGZvcm1hdGlvbjpzdGFjaycpIHsgY29udGludWU7IH1cblxuICAgICAgICBjb25zdCB0ZW1wbGF0ZSA9IGF3YWl0IGZzLnJlYWRKU09OKHBhdGgucmVzb2x2ZSh0aGlzLmRpcmVjdG9yeSwgQ0RLX09VVERJUiwgYXJ0aWZhY3QucHJvcGVydGllcy50ZW1wbGF0ZUZpbGUpKTtcbiAgICAgICAgc3RhY2tzW2FydGlmYWN0SWRdID0gdGVtcGxhdGU7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN0YWNrc1RvRGlmZiA9IGF3YWl0IHRoaXMucmVhZFN0YWNrUHJhZ21hKCk7XG5cbiAgICAgIGlmIChzdGFja3NUb0RpZmYubGVuZ3RoID4gMCkge1xuICAgICAgICAvLyBUaGlzIGlzIGEgbW9uc3Rlci4gSSdtIHNvcnJ5LiA6KFxuICAgICAgICBjb25zdCB0ZW1wbGF0ZXMgPSBzdGFja3NUb0RpZmYubGVuZ3RoID09PSAxICYmIHN0YWNrc1RvRGlmZlswXSA9PT0gJyonXG4gICAgICAgICAgPyBPYmplY3QudmFsdWVzKHN0YWNrcylcbiAgICAgICAgICA6IHN0YWNrc1RvRGlmZi5tYXAodGVtcGxhdGVGb3JTdGFja05hbWUpO1xuXG4gICAgICAgIC8vIFdlJ3JlIHN1cHBvc2VkIHRvIGp1c3QgcmV0dXJuICphKiB0ZW1wbGF0ZSAod2hpY2ggaXMgYW4gb2JqZWN0KSwgYnV0IHRoZXJlJ3MgYSBjcmF6eVxuICAgICAgICAvLyBjYXNlIGluIHdoaWNoIHdlIGRpZmYgbXVsdGlwbGUgdGVtcGxhdGVzIGF0IG9uY2UgYW5kIHRoZW4gdGhleSdyZSBhbiBhcnJheS4gQW5kIGl0IHdvcmtzIHNvbWVob3cuXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZXMubGVuZ3RoID09PSAxID8gdGVtcGxhdGVzWzBdIDogdGVtcGxhdGVzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgbmFtZXMgPSBPYmplY3Qua2V5cyhzdGFja3MpO1xuICAgICAgICBpZiAobmFtZXMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdcImNkay1pbnRlZ1wiIGNhbiBvbmx5IG9wZXJhdGUgb24gYXBwcyB3aXRoIGEgc2luZ2xlIHN0YWNrLlxcblxcbicgK1xuICAgICAgICAgICAgJyAgSWYgeW91ciBhcHAgaGFzIG11bHRpcGxlIHN0YWNrcywgc3BlY2lmeSB3aGljaCBzdGFjayB0byBzZWxlY3QgYnkgYWRkaW5nIHRoaXMgdG8geW91ciB0ZXN0IHNvdXJjZTpcXG5cXG4nICtcbiAgICAgICAgICAgIGAgICAgICAke0NES19JTlRFR19TVEFDS19QUkFHTUF9IFNUQUNLIC4uLlxcblxcbmAgK1xuICAgICAgICAgICAgYCAgQXZhaWxhYmxlIHN0YWNrczogJHtuYW1lcy5qb2luKCcgJyl9ICh3aWxkY2FyZHMgYXJlIGFsc28gc3VwcG9ydGVkKVxcbmApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdGFja3NbbmFtZXNbMF1dO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiB0ZW1wbGF0ZUZvclN0YWNrTmFtZShuYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKCFzdGFja3NbbmFtZV0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIHN1Y2ggc3RhY2sgaW4gb3V0cHV0OiAke25hbWV9YCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0YWNrc1tuYW1lXTtcbiAgICAgIH1cbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5jbGVhbnVwVGVtcG9yYXJ5RmlsZXMoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogSW52b2tlIHRoZSBDREsgQ0xJIHdpdGggc29tZSBvcHRpb25zXG4gICAqL1xuICBwdWJsaWMgYXN5bmMgaW52b2tlQ2xpKGFyZ3M6IHN0cmluZ1tdLCBvcHRpb25zOiB7IGpzb24/OiBib29sZWFuLCBjb250ZXh0PzogYW55LCB2ZXJib3NlPzogYm9vbGVhbiwgZW52PzogYW55IH0gPSB7IH0pOiBQcm9taXNlPGFueT4ge1xuICAgIC8vIFdyaXRlIGNvbnRleHQgdG8gY2RrLmpzb24sIGFmdGVyd2FyZHMgZGVsZXRlLiBXZSBuZWVkIHRvIGRvIHRoaXMgYmVjYXVzZSB0aGVyZSBpcyBubyB3YXlcbiAgICAvLyB0byBwYXNzIHN0cnVjdHVyZWQgY29udGV4dCBkYXRhIGZyb20gdGhlIGNvbW1hbmQtbGluZSwgY3VycmVudGx5LlxuICAgIGlmIChvcHRpb25zLmNvbnRleHQpIHtcbiAgICAgIGF3YWl0IHRoaXMud3JpdGVDZGtDb250ZXh0KG9wdGlvbnMuY29udGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xlYW51cFRlbXBvcmFyeUZpbGVzKCk7XG4gICAgfVxuXG4gICAgY29uc3QgY2xpU3dpdGNoZXMgPSBbXG4gICAgICAvLyBUaGlzIHdvdWxkIG90aGVyd2lzZSB0cmlwIG9uIGV2ZXJ5IHZlcnNpb24gdXBkYXRlXG4gICAgICAnLS1uby12ZXJzaW9uLXJlcG9ydGluZycsXG4gICAgICAvLyBkb24ndCBpbmplY3QgY2xvdWRmb3JtYXRpb24gbWV0YWRhdGEgaW50byB0ZW1wbGF0ZVxuICAgICAgJy0tbm8tcGF0aC1tZXRhZGF0YScsXG4gICAgICAnLS1uby1hc3NldC1tZXRhZGF0YScsXG4gICAgICAvLyBzYXZlIGEgY29weSBzdGVwIGJ5IG5vdCBzdGFnaW5nIGFzc2V0c1xuICAgICAgJy0tbm8tc3RhZ2luZycsXG4gICAgICAvLyBEaWZmZXJlbnQgb3V0cHV0IGRpcmVjdG9yeVxuICAgICAgJy1vJywgQ0RLX09VVERJUixcbiAgICBdO1xuXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNkayA9IHJlcXVpcmUucmVzb2x2ZSgnYXdzLWNkay9iaW4vY2RrJyk7XG4gICAgICByZXR1cm4gZXhlYyhbY2RrLCAnLWEnLCBgbm9kZSAke3RoaXMubmFtZX1gLCAuLi5jbGlTd2l0Y2hlcywgLi4uYXJnc10sIHtcbiAgICAgICAgY3dkOiB0aGlzLmRpcmVjdG9yeSxcbiAgICAgICAganNvbjogb3B0aW9ucy5qc29uLFxuICAgICAgICB2ZXJib3NlOiBvcHRpb25zLnZlcmJvc2UsXG4gICAgICAgIGVudjogb3B0aW9ucy5lbnYsXG4gICAgICB9KTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgdGhpcy5jbGVhbnVwVGVtcG9yYXJ5RmlsZXMoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaGFzRXhwZWN0ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGZzLmV4aXN0c1N5bmModGhpcy5leHBlY3RlZEZpbGVQYXRoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBzaW5nbGUgdGVzdCBzdGFjayB0byB1c2UuXG4gICAqXG4gICAqIElmIHRoZSB0ZXN0IGhhcyBhIHNpbmdsZSBzdGFjaywgaXQgd2lsbCBiZSBjaG9zZW4uIE90aGVyd2lzZSBhIHByYWdtYSBpcyBleHBlY3RlZCB3aXRoaW4gdGhlXG4gICAqIHRlc3QgZmlsZSB0aGUgbmFtZSBvZiB0aGUgc3RhY2s6XG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgIC8vLyAhY2RrLWludGVnIDxzdGFjay1uYW1lPlxuICAgKlxuICAgKi9cbiAgcHVibGljIGFzeW5jIGRldGVybWluZVRlc3RTdGFjaygpOiBQcm9taXNlPHN0cmluZ1tdPiB7XG4gICAgY29uc3QgcHJhZ21hID0gKGF3YWl0IHRoaXMucmVhZFN0YWNrUHJhZ21hKCkpO1xuICAgIGlmIChwcmFnbWEubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHByYWdtYTtcbiAgICB9XG5cbiAgICBjb25zdCBzdGFja3MgPSAoYXdhaXQgdGhpcy5pbnZva2VDbGkoWydscyddLCB7IC4uLkRFRkFVTFRfU1lOVEhfT1BUSU9OUyB9KSkuc3BsaXQoJ1xcbicpO1xuICAgIGlmIChzdGFja3MubGVuZ3RoICE9PSAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1wiY2RrLWludGVnXCIgY2FuIG9ubHkgb3BlcmF0ZSBvbiBhcHBzIHdpdGggYSBzaW5nbGUgc3RhY2suXFxuXFxuJyArXG4gICAgICAgICcgIElmIHlvdXIgYXBwIGhhcyBtdWx0aXBsZSBzdGFja3MsIHNwZWNpZnkgd2hpY2ggc3RhY2sgdG8gc2VsZWN0IGJ5IGFkZGluZyB0aGlzIHRvIHlvdXIgdGVzdCBzb3VyY2U6XFxuXFxuJyArXG4gICAgICAgIGAgICAgICAke0NES19JTlRFR19TVEFDS19QUkFHTUF9IFNUQUNLIC4uLlxcblxcbmAgK1xuICAgICAgICBgICBBdmFpbGFibGUgc3RhY2tzOiAke3N0YWNrcy5qb2luKCcgJyl9ICh3aWxkY2FyZHMgYXJlIGFsc28gc3VwcG9ydGVkKVxcbmApO1xuICAgIH1cblxuICAgIHJldHVybiBzdGFja3M7XG4gIH1cblxuICBwdWJsaWMgYXN5bmMgcmVhZEV4cGVjdGVkKCk6IFByb21pc2U8YW55PiB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYXdhaXQgZnMucmVhZEZpbGUodGhpcy5leHBlY3RlZEZpbGVQYXRoLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pKTtcbiAgfVxuXG4gIHB1YmxpYyBhc3luYyB3cml0ZUV4cGVjdGVkKGFjdHVhbDogYW55KSB7XG4gICAgYXdhaXQgZnMud3JpdGVGaWxlKHRoaXMuZXhwZWN0ZWRGaWxlUGF0aCwgSlNPTi5zdHJpbmdpZnkoYWN0dWFsLCB1bmRlZmluZWQsIDIpLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbm9uLXN0YWNrIHByYWdtYXNcbiAgICpcbiAgICogVGhlc2UgYXJlIGFsbCBwcmFnbWFzIHRoYXQgc3RhcnQgd2l0aCBcInByYWdtYTpcIi5cbiAgICpcbiAgICogRm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5IHJlYXNvbnMsIGFsbCBwcmFnbWFzIHRoYXQgRE9OJ1Qgc3RhcnQgd2l0aCB0aGlzXG4gICAqIHN0cmluZyBhcmUgY29uc2lkZXJlZCB0byBiZSBzdGFjayBuYW1lcy5cbiAgICovXG4gIHB1YmxpYyBhc3luYyBwcmFnbWFzKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICByZXR1cm4gKGF3YWl0IHRoaXMucmVhZEludGVnUHJhZ21hKCkpLmZpbHRlcihwID0+IHAuc3RhcnRzV2l0aChQUkFHTUFfUFJFRklYKSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIHdyaXRlQ2RrQ29udGV4dChjb25maWc6IGFueSkge1xuICAgIGF3YWl0IGZzLndyaXRlRmlsZSh0aGlzLmNka0NvbnRleHRQYXRoLCBKU09OLnN0cmluZ2lmeShjb25maWcsIHVuZGVmaW5lZCwgMiksIHsgZW5jb2Rpbmc6ICd1dGYtOCcgfSk7XG4gIH1cblxuICBwcml2YXRlIGNsZWFudXBUZW1wb3JhcnlGaWxlcygpIHtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyh0aGlzLmNka0NvbnRleHRQYXRoKSkge1xuICAgICAgZnMudW5saW5rU3luYyh0aGlzLmNka0NvbnRleHRQYXRoKTtcbiAgICB9XG5cbiAgICBjb25zdCBjZGtPdXRQYXRoID0gcGF0aC5qb2luKHRoaXMuZGlyZWN0b3J5LCBDREtfT1VURElSKTtcbiAgICBpZiAoZnMuZXhpc3RzU3luYyhjZGtPdXRQYXRoKSkge1xuICAgICAgZnMucmVtb3ZlU3luYyhjZGtPdXRQYXRoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmVhZHMgc3RhY2sgbmFtZXMgZnJvbSB0aGUgXCIhY2RrLWludGVnXCIgcHJhZ21hLlxuICAgKlxuICAgKiBFdmVyeSB3b3JkIHRoYXQncyBOT1QgcHJlZml4ZWQgYnkgXCJwcmFnbWE6XCIgaXMgY29uc2lkZXJlZCBhIHN0YWNrIG5hbWUuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqXG4gICAqICAgIC8vLyAhY2RrLWludGVnIDxzdGFjay1uYW1lPlxuICAgKi9cbiAgcHJpdmF0ZSBhc3luYyByZWFkU3RhY2tQcmFnbWEoKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIHJldHVybiAoYXdhaXQgdGhpcy5yZWFkSW50ZWdQcmFnbWEoKSkuZmlsdGVyKHAgPT4gIXAuc3RhcnRzV2l0aChQUkFHTUFfUFJFRklYKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVhZCBhcmJpdHJhcnkgY2RrLWludGVnIHByYWdtYSBkaXJlY3RpdmVzXG4gICAqXG4gICAqIFJlYWRzIHRoZSB0ZXN0IHNvdXJjZSBmaWxlIGFuZCBsb29rcyBmb3IgdGhlIFwiIWNkay1pbnRlZ1wiIHByYWdtYS4gSWYgaXQgZXhpc3RzLCByZXR1cm5zIGl0J3NcbiAgICogY29udGVudHMuIFRoaXMgYWxsb3dzIGludGVnIHRlc3RzIHRvIHN1cHBseSBjdXN0b20gY29tbWFuZCBsaW5lIGFyZ3VtZW50cyB0byBcImNkayBkZXBsb3lcIiBhbmQgXCJjZGsgc3ludGhcIi5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICpcbiAgICogICAgLy8vICFjZGstaW50ZWcgWy4uLl1cbiAgICovXG4gIHByaXZhdGUgYXN5bmMgcmVhZEludGVnUHJhZ21hKCk6IFByb21pc2U8c3RyaW5nW10+IHtcbiAgICBjb25zdCBzb3VyY2UgPSBhd2FpdCBmcy5yZWFkRmlsZSh0aGlzLnNvdXJjZUZpbGVQYXRoLCB7IGVuY29kaW5nOiAndXRmLTgnIH0pO1xuICAgIGNvbnN0IHByYWdtYUxpbmUgPSBzb3VyY2Uuc3BsaXQoJ1xcbicpLmZpbmQoeCA9PiB4LnN0YXJ0c1dpdGgoQ0RLX0lOVEVHX1NUQUNLX1BSQUdNQSArICcgJykpO1xuICAgIGlmICghcHJhZ21hTGluZSkge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGFyZ3MgPSBwcmFnbWFMaW5lLnN1YnN0cmluZyhDREtfSU5URUdfU1RBQ0tfUFJBR01BLmxlbmd0aCkudHJpbSgpLnNwbGl0KCcgJyk7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgc3ludGF4IGZvciBjZGstaW50ZWcgcHJhZ21hLiBVc2FnZTogXCIke0NES19JTlRFR19TVEFDS19QUkFHTUF9IFtTVEFDS10gW3ByYWdtYTpQUkFHTUFdIFsuLi5dXCJgKTtcbiAgICB9XG4gICAgcmV0dXJuIGFyZ3M7XG4gIH1cbn1cblxuLy8gRGVmYXVsdCBjb250ZXh0IHdlIHJ1biBhbGwgaW50ZWcgdGVzdHMgd2l0aCwgc28gdGhleSBkb24ndCBkZXBlbmQgb24gdGhlXG4vLyBhY2NvdW50IG9mIHRoZSBleGVyY2lzaW5nIHVzZXIuXG5leHBvcnQgY29uc3QgREVGQVVMVF9TWU5USF9PUFRJT05TID0ge1xuICBjb250ZXh0OiB7XG4gICAgW0FWQUlMQUJJTElUWV9aT05FX0ZBTExCQUNLX0NPTlRFWFRfS0VZXTogWyd0ZXN0LXJlZ2lvbi0xYScsICd0ZXN0LXJlZ2lvbi0xYicsICd0ZXN0LXJlZ2lvbi0xYyddLFxuICAgICdhdmFpbGFiaWxpdHktem9uZXM6YWNjb3VudD0xMjM0NTY3ODpyZWdpb249dGVzdC1yZWdpb24nOiBbJ3Rlc3QtcmVnaW9uLTFhJywgJ3Rlc3QtcmVnaW9uLTFiJywgJ3Rlc3QtcmVnaW9uLTFjJ10sXG4gICAgJ3NzbTphY2NvdW50PTEyMzQ1Njc4OnBhcmFtZXRlck5hbWU9L2F3cy9zZXJ2aWNlL2FtaS1hbWF6b24tbGludXgtbGF0ZXN0L2Ftem4tYW1pLWh2bS14ODZfNjQtZ3AyOnJlZ2lvbj10ZXN0LXJlZ2lvbic6ICdhbWktMTIzNCcsXG4gICAgJ3NzbTphY2NvdW50PTEyMzQ1Njc4OnBhcmFtZXRlck5hbWU9L2F3cy9zZXJ2aWNlL2FtaS1hbWF6b24tbGludXgtbGF0ZXN0L2Ftem4yLWFtaS1odm0teDg2XzY0LWdwMjpyZWdpb249dGVzdC1yZWdpb24nOiAnYW1pLTEyMzQnLFxuICAgICdzc206YWNjb3VudD0xMjM0NTY3ODpwYXJhbWV0ZXJOYW1lPS9hd3Mvc2VydmljZS9lY3Mvb3B0aW1pemVkLWFtaS9hbWF6b24tbGludXgvcmVjb21tZW5kZWQ6cmVnaW9uPXRlc3QtcmVnaW9uJzogJ3tcImltYWdlX2lkXCI6IFwiYW1pLTEyMzRcIn0nLFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtbGVuXG4gICAgJ2FtaTphY2NvdW50PTEyMzQ1Njc4OmZpbHRlcnMuaW1hZ2UtdHlwZS4wPW1hY2hpbmU6ZmlsdGVycy5uYW1lLjA9YW16bi1hbWktdnBjLW5hdC0qOmZpbHRlcnMuc3RhdGUuMD1hdmFpbGFibGU6b3duZXJzLjA9YW1hem9uOnJlZ2lvbj10ZXN0LXJlZ2lvbic6ICdhbWktMTIzNCcsXG4gICAgJ3ZwYy1wcm92aWRlcjphY2NvdW50PTEyMzQ1Njc4OmZpbHRlci5pc0RlZmF1bHQ9dHJ1ZTpyZWdpb249dGVzdC1yZWdpb246cmV0dXJuQXN5bW1ldHJpY1N1Ym5ldHM9dHJ1ZSc6IHtcbiAgICAgIHZwY0lkOiAndnBjLTYwOTAwOTA1JyxcbiAgICAgIHN1Ym5ldEdyb3VwczogW1xuICAgICAgICB7XG4gICAgICAgICAgdHlwZTogJ1B1YmxpYycsXG4gICAgICAgICAgbmFtZTogJ1B1YmxpYycsXG4gICAgICAgICAgc3VibmV0czogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBzdWJuZXRJZDogJ3N1Ym5ldC1lMTk0NTVjYScsXG4gICAgICAgICAgICAgIGF2YWlsYWJpbGl0eVpvbmU6ICd1cy1lYXN0LTFhJyxcbiAgICAgICAgICAgICAgcm91dGVUYWJsZUlkOiAncnRiLWUxOTQ1NWNhJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHN1Ym5ldElkOiAnc3VibmV0LWUwYzI0Nzk3JyxcbiAgICAgICAgICAgICAgYXZhaWxhYmlsaXR5Wm9uZTogJ3VzLWVhc3QtMWInLFxuICAgICAgICAgICAgICByb3V0ZVRhYmxlSWQ6ICdydGItZTBjMjQ3OTcnLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgc3VibmV0SWQ6ICdzdWJuZXQtY2NkNzczOTUnLFxuICAgICAgICAgICAgICBhdmFpbGFiaWxpdHlab25lOiAndXMtZWFzdC0xYycsXG4gICAgICAgICAgICAgIHJvdXRlVGFibGVJZDogJ3J0Yi1jY2Q3NzM5NScsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgIH0sXG4gICAgICBdLFxuICAgIH0sXG4gICAgLy8gRW5hYmxlIGZlYXR1cmUgZmxhZ3MgZm9yIGFsbCBpbnRlZyB0ZXN0c1xuICAgIC4uLkZVVFVSRV9GTEFHUyxcbiAgfSxcbiAgZW52OiB7XG4gICAgQ0RLX0lOVEVHX0FDQ09VTlQ6ICcxMjM0NTY3OCcsXG4gICAgQ0RLX0lOVEVHX1JFR0lPTjogJ3Rlc3QtcmVnaW9uJyxcbiAgfSxcbn07XG5cbi8qKlxuICogT3VyIG93biBleGVjdXRlIGZ1bmN0aW9uIHdoaWNoIGRvZXNuJ3QgdXNlIHNoZWxscyBhbmQgc3RyaW5ncy5cbiAqL1xuZnVuY3Rpb24gZXhlYyhjb21tYW5kTGluZTogc3RyaW5nW10sIG9wdGlvbnM6IHsgY3dkPzogc3RyaW5nLCBqc29uPzogYm9vbGVhbiwgdmVyYm9zZT86IGJvb2xlYW4sIGVudj86IGFueSB9ID0geyB9KTogYW55IHtcbiAgY29uc3QgcHJvYyA9IHNwYXduU3luYyhjb21tYW5kTGluZVswXSwgY29tbWFuZExpbmUuc2xpY2UoMSksIHtcbiAgICBzdGRpbzogWydpZ25vcmUnLCAncGlwZScsIG9wdGlvbnMudmVyYm9zZSA/ICdpbmhlcml0JyA6ICdwaXBlJ10sIC8vIGluaGVyaXQgU1RERVJSIGluIHZlcmJvc2UgbW9kZVxuICAgIGVudjoge1xuICAgICAgLi4ucHJvY2Vzcy5lbnYsXG4gICAgICBDREtfSU5URUdfTU9ERTogJzEnLFxuICAgICAgLi4ub3B0aW9ucy5lbnYsXG4gICAgfSxcbiAgICBjd2Q6IG9wdGlvbnMuY3dkLFxuICB9KTtcblxuICBpZiAocHJvYy5lcnJvcikgeyB0aHJvdyBwcm9jLmVycm9yOyB9XG4gIGlmIChwcm9jLnN0YXR1cyAhPT0gMCkge1xuICAgIGlmIChwcm9jZXNzLnN0ZGVycikgeyAvLyB3aWxsIGJlICdudWxsJyBpbiB2ZXJib3NlIG1vZGVcbiAgICAgIHByb2Nlc3Muc3RkZXJyLndyaXRlKHByb2Muc3RkZXJyKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKGBDb21tYW5kIGV4aXRlZCB3aXRoICR7cHJvYy5zdGF0dXMgPyBgc3RhdHVzICR7cHJvYy5zdGF0dXN9YCA6IGBzaWduYWwgJHtwcm9jLnNpZ25hbH1gfWApO1xuICB9XG5cbiAgY29uc3Qgb3V0cHV0ID0gcHJvYy5zdGRvdXQudG9TdHJpbmcoJ3V0Zi04JykudHJpbSgpO1xuXG4gIHRyeSB7XG4gICAgaWYgKG9wdGlvbnMuanNvbikge1xuICAgICAgaWYgKG91dHB1dC5sZW5ndGggPT09IDApIHsgcmV0dXJuIHt9OyB9XG5cbiAgICAgIHJldHVybiBKU09OLnBhcnNlKG91dHB1dCk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICAgIGNvbnNvbGUuZXJyb3IoJ05vdCBKU09OOiAnICsgb3V0cHV0KTtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvbW1hbmQgb3V0cHV0IGlzIG5vdCBKU09OJyk7XG4gIH1cbn1cbiJdfQ==