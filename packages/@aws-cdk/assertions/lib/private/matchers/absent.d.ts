import { Matcher, MatchResult } from '../../matcher';
export declare class AbsentMatch extends Matcher {
    readonly name: string;
    constructor(name: string);
    test(actual: any): MatchResult;
}
