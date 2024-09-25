export type LogLevel = 'verbose' | 'info' | 'error';
export declare const VERSION: any;
export declare function setLogThreshold(threshold: LogLevel): void;
export declare function log(level: LogLevel, message: string): void;
