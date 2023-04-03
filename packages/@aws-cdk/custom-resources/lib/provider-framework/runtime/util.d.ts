export declare function getEnv(name: string): string;
export declare function log(title: any, ...args: any[]): void;
export interface RetryOptions {
    /** How many retries (will at least try once) */
    readonly attempts: number;
    /** Sleep base, in ms */
    readonly sleep: number;
}
export declare function withRetries<A extends Array<any>, B>(options: RetryOptions, fn: (...xs: A) => Promise<B>): (...xs: A) => Promise<B>;
