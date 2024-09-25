type Logger = (x: string) => void;
export declare function zipDirectory(directory: string, outputFile: string, logger: Logger): Promise<void>;
export {};
