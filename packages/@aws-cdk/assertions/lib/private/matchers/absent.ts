import { Matcher, MatchResult } from '../../matcher';

export class AbsentMatch extends Matcher {
  constructor(public readonly name: string) {
    super();
  }

  public test(actual: any): MatchResult {
    const result = new MatchResult(actual);
    if (actual !== undefined) {
      result.push(this, [], `Received ${actual}, but key should be absent`);
    }
    return result;
  }
}