import { Matcher, MatchResult } from '@aws-cdk/assertions';

export function stringLike(pattern: string | RegExp): Matcher {
  return new RegexMatcher(new RegExp(pattern));
}

export class RegexMatcher extends Matcher {
  constructor(private readonly pattern: RegExp, public readonly name: string = 'RegexMatch') { super(); }
  public test(actual: any): MatchResult {
    const result = new MatchResult(actual);
    if (!this.pattern.test(actual)) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Expected ${actual} to match ${this.pattern}`,
      });
    }
    return result;
  }
}
