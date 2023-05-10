/**
 * Our own execute function which doesn't use shells and strings.
 */
export declare function exec(commandLine: string[], options?: {
    cwd?: string;
    json?: boolean;
    verbose?: boolean;
    env?: any;
}): any;
