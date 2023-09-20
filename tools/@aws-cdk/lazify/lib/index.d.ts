type LogFn = (...x: string[]) => void;
export declare function transformFile(filename: string): Promise<void>;
export declare function transformFileContents(filename: string, contents: string, progress?: LogFn): string;
export {};
