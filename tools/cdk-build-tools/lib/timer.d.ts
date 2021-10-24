/**
 * A single timer
 */
export declare class Timer {
    readonly label: string;
    timeMs?: number;
    private startTime;
    constructor(label: string);
    start(): void;
    end(): void;
    isSet(): boolean;
    humanTime(): string;
}
/**
 * A collection of Timers
 */
export declare class Timers {
    private readonly timers;
    record<T>(label: string, operation: () => T): T;
    recordAsync<T>(label: string, operation: () => Promise<T>): Promise<T>;
    start(label: string): Timer;
    display(): string;
}
