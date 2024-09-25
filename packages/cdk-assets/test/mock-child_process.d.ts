export interface Invocation {
    commandLine: string[];
    cwd?: string;
    exitCode?: number;
    stdout?: string;
    /**
     * Only match a prefix of the command (don't care about the details of the arguments)
     */
    prefix?: boolean;
}
export declare function mockSpawn(...invocations: Invocation[]): () => void;
