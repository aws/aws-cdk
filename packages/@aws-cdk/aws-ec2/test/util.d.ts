import { Matcher, MatchResult } from '@aws-cdk/assertions';
export declare function stringLike(pattern: string | RegExp): Matcher;
export declare class RegexMatcher extends Matcher {
    private readonly pattern;
    readonly name: string;
    constructor(pattern: RegExp, name?: string);
    test(actual: any): MatchResult;
}
