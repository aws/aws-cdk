import { MatchResult } from '../matcher';
export type MatchSuccess = {
    match: true;
    matches: {
        [key: string]: any;
    };
    analyzed: {
        [key: string]: any;
    };
    analyzedCount: number;
};
export type MatchFailure = {
    match: false;
    closestResults: Record<string, MatchResult>;
    analyzed: {
        [key: string]: any;
    };
    analyzedCount: number;
};
export declare function matchSection(section: any, props: any): MatchSuccess | MatchFailure;
export declare function formatAllMatches(matches: {
    [key: string]: any;
}): string;
export declare function formatAllMismatches(analyzed: {
    [key: string]: any;
}, matches?: {
    [key: string]: any;
}): string;
export declare function formatSectionMatchFailure(qualifier: string, result: MatchFailure, what?: string): string;
export declare function formatFailure(closestResults: Record<string, MatchResult>): string;
export declare function filterLogicalId(section: {
    [key: string]: {};
}, logicalId: string): {
    [key: string]: {};
};
