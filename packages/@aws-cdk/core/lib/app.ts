import * as cxapi from '@aws-cdk/cx-api';
import { BASE64_REQ_PREFIX, CXRequest } from '@aws-cdk/cx-api';
import { Base64 } from 'js-base64';
import { PATH_SEP } from '.';
import { Stack } from './cloudformation/stack';
import { Construct, MetadataEntry, Root } from './core/construct';
import { resolve } from './core/tokens';

/**
 * Cloud Executable interface version.
 */
const CX_VERSION = 'CloudExecutable/1.0';

/**
 * Represents a CDK program.
 */
export class App extends Root {
    private readonly progname?: string;
    private readonly request?: cxapi.CXRequest;

    constructor(argv?: string[]) {
        super();

        argv = argv || [];

        if (argv.length >= 1) {
            // if the first argument ends with "/node" or "node.exe", skip it (this is argv[0] in node programs).
            if (/[\/\\]node(?:\.exe)?$/.test(argv[0])) {
                argv = argv.slice(1);
            }

            this.progname = argv[0].split('/').pop()!;
        }

        if (argv.length > 1) {
            try {
                this.request = this.parseRequest(argv[1]);
            } catch (e) {
                throw new Error(`Cannot parse request '${argv[1]}': ${e.message}`);
            }
            this.loadContext();
        }
    }

    private get stacks() {
        const out: { [name: string]: Stack } = { };
        for (const child of this.children) {
            if (!(child instanceof Stack)) {
                throw new Error(`The child ${child.toString()} of Program must be a Stack`);
            }

            out[child.name] = child as Stack;
        }
        return out;
    }

    /**
     * Runs the program
     * @returns STDOUT
     */
    public run(): string {
        // no arguments - print usage and exit successfully.
        if (!this.request || !this.request.type) {
            return this.usage;
        }

        const result = this.runCommand();
        return JSON.stringify(result, undefined, 2);
    }

    /**
     * @deprecated Use app.run().
     */
    public async exec(): Promise<string> {
        return this.run();
    }

    /**
     * Lists all stacks in this app.
     */
    public listStacks(): cxapi.StackInfo[] {
        return Object.keys(this.stacks).map(name => {
            const stack = this.stacks[name];
            const region = stack.env.region;
            const account = stack.env.account;
            let environment: cxapi.Environment | undefined;
            if (account && region) {
                environment = { name: `${account}/${region}`, account, region };
            }
            return { name, environment };
        });
    }

    /**
     * Synthesize and validate a single stack
     * @param stackName The name of the stack to synthesize
     */
    public synthesizeStack(stackName: string): cxapi.SynthesizedStack {
        const stack = this.getStack(stackName);

        // first, validate this stack and stop if there are errors.
        const errors = stack.validateTree();
        if (errors.length > 0) {
            const errorList = errors.map(e => `[${e.source.path}] ${e.message}`).join('\n    ');
            throw new Error(`Stack validation failed with the following errors:\n    ${errorList}`);
        }

        let environment: cxapi.Environment | undefined;
        if (stack.env.account && stack.env.region) {
            environment = {
                name: `${stack.env.account}/${stack.env.region}`,
                account: stack.env.account,
                region: stack.env.region
            };
        }

        return {
            name: stack.name,
            environment,
            missing: Object.keys(stack.missingContext).length ? stack.missingContext : undefined,
            template: stack.toCloudFormation(),
            metadata: this.collectMetadata(stack)
        };
    }

    /**
     * Synthesizes multiple stacks
     */
    public synthesizeStacks(stackNames: string[]): cxapi.SynthesizedStack[] {
        const ret: cxapi.SynthesizedStack[] = [];
        for (const stackName of stackNames) {
            ret.push(this.synthesizeStack(stackName));
        }
        return ret;
    }

    /**
     * Returns metadata for all constructs in the stack.
     */
    public collectMetadata(stack: Stack) {
        const output: { [id: string]: MetadataEntry[] } = { };

        visit(stack);

        // add app-level metadata under "."
        if (this.metadata.length > 0) {
            output[PATH_SEP] = this.metadata;
        }

        return output;

        function visit(node: Construct) {
            if (node.metadata.length > 0) {
                // Make the path absolute
                output[PATH_SEP + node.path] = node.metadata.map(md => resolve(md) as MetadataEntry);
            }

            for (const child of node.children) {
                visit(child);
            }
        }
    }

    private getStack(stackname: string) {
        if (stackname == null) {
            throw new Error('Stack name must be defined');
        }

        const stack = this.stacks[stackname];
        if (!stack) {
            throw new Error(`Cannot find stack ${stackname}`);
        }
        return stack;
    }

    private runCommand() {
        switch (this.request!.type) {
            case 'list':
                return {
                    stacks: this.listStacks()
                } as cxapi.ListStacksResponse;

            case 'synth':
                return {
                    stacks: this.synthesizeStacks((this.request as cxapi.SynthesizeRequest).stacks)
                } as cxapi.SynthesizeResponse;

            default:
                throw new Error(`Invalid command: ${this.request!.type}`);
        }
    }

    private get usage() {
        const progname = this.progname ? this.progname + ' ' : '';

        return `${CX_VERSION}

Usage:
  ${progname}REQUEST

REQUEST is a JSON-encoded request object.
`;
    }

    private loadContext() {
        const context = (this.request && this.request.context) || {};
        for (const key of Object.keys(context)) {
            this.setContext(key, context[key]);
        }
    }

    private parseRequest(req: string): CXRequest {
        // allow toolkit to send request in base64 if they begin with "base64:"
        // this is in order to avoid shell escaping issues when defining "--app"
        // in the toolkit.
        if (req.startsWith(BASE64_REQ_PREFIX)) {
            req = Base64.fromBase64(req.slice(BASE64_REQ_PREFIX.length));
        }

        // parse as JSON
        return JSON.parse(req);
    }
}

export class Program extends App {
    constructor(argv?: string[]) {
        super(argv);
        this.addWarning('"Program" is deprecated in favor of "App"');
    }
}
