export interface ShellOptions {
    readonly cwd?: string;
    readonly quiet?: boolean;
}
export declare function shell(command: string, options?: ShellOptions): string;
