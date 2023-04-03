export interface SimpleStatistic {
    type: 'simple';
    statistic: string;
}
export interface GenericStatistic {
    type: 'generic';
    statistic: string;
}
export interface ParseableStatistic {
    statPrefix: string;
    statName: string;
    rawStatistic: string;
}
export interface SingleStatistic extends ParseableStatistic {
    type: 'single';
    value: number;
}
export interface PairStatistic extends ParseableStatistic {
    type: 'pair';
    isPercent: boolean;
    lower?: number;
    upper?: number;
    canBeSingleStat: boolean;
    asSingleStatStr?: string;
}
export interface PercentileStatistic extends SingleStatistic {
    statName: 'percentile';
}
export interface TrimmedMeanStatistic extends PairStatistic {
    statName: 'trimmedMean';
}
export interface WinsorizedMeanStatistic extends PairStatistic {
    statName: 'winsorizedMean';
}
export interface TrimmedCountStatistic extends PairStatistic {
    statName: 'trimmedCount';
}
export interface TrimmedSumStatistic extends PairStatistic {
    statName: 'trimmedSum';
}
export declare function singleStatisticToString(parsed: SingleStatistic): string;
export declare function pairStatisticToString(parsed: PairStatistic): string;
/**
 * Parse a statistic, returning the type of metric that was used
 */
export declare function parseStatistic(stat: string): SimpleStatistic | PercentileStatistic | TrimmedMeanStatistic | WinsorizedMeanStatistic | TrimmedCountStatistic | TrimmedSumStatistic | GenericStatistic;
export declare function normalizeStatistic(parsed: ReturnType<typeof parseStatistic>): string;
export declare function normalizeRawStringStatistic(stat: string): string;
