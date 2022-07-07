import { Match, Matcher, MatchResult } from '@aws-cdk/assertions';
import { enumerate } from '../../lib/private/javascript';

export function stringLike(pattern: string) {
  return new StringLike(pattern);
}

export function sortByRunOrder(pattern: any[]): Matcher {
  return new Sorter('SortByRunOrder', pattern, (a: any, b: any) => {
    if (a.RunOrder !== b.RunOrder) { return a.RunOrder - b.RunOrder; }
    return (a.Name as string).localeCompare(b.Name);
  });
}

export function stringNoLongerThan(max: number): Matcher {
  return new StringLengthMatcher(max);
}

export function setContainsAll<A>(elements: A[]): Matcher {
  return new SetContainsAllMatcher(elements);
}

// Reimplementation of
// https://github.com/aws/aws-cdk/blob/430f50a546e9c575f8cdbd259367e440d985e68f/packages/%40aws-cdk/assert-internal/lib/assertions/have-resource-matchers.ts#L244
class StringLike extends Matcher {
  public name = 'StringLike';

  constructor(private readonly pattern: string) {
    super();
  }

  public test(actual: any): MatchResult {
    if (typeof(actual) !== 'string') {
      throw new Error(`Expected string but found ${typeof(actual)} ${JSON.stringify(actual)}`);
    }
    const re = new RegExp(`^${this.pattern.split('*').map(escapeRegex).join('.*')}$`);

    const result = new MatchResult(actual);
    if (!re.test(actual)) {
      result.push(this, [], `Looking for string with pattern "${this.pattern}" but found "${actual}"`);
    }
    return result;

    function escapeRegex(s: string) {
      return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }
  }
}

class Sorter extends Matcher {
  constructor(
    public readonly name: string,
    private readonly pattern: any[],
    private readonly compareFn: (a: any, b: any) => number,
  ) {
    super();
  }

  public test(actual: any): MatchResult {
    const result = new MatchResult(actual);
    if (!Array.isArray(actual)) {
      result.push(this, [], `Expected an Array, but got '${typeof actual}'`);
      return result;
    }

    const copy = actual.slice();
    copy.sort(this.compareFn);

    const matcher = Matcher.isMatcher(this.pattern) ? this.pattern : Match.exact(this.pattern);
    return matcher.test(copy);
  }
}

class StringLengthMatcher extends Matcher {
  public name: string = 'StringLength'

  constructor(private readonly length: number) {
    super();
  }

  public test(actual: any): MatchResult {
    const result = new MatchResult(actual);

    if (typeof actual !== 'string') {
      result.push(this, [], `Expected a string, but got '${typeof actual}'`);
    }

    if (actual.length > this.length) {
      result.push(this, [], `String is ${actual.length} characters long. Expected at most ${this.length} characters`);
    }

    return result;
  }
}

class SetContainsAllMatcher<A> extends Matcher {
  public name: string = 'SetContainsAll'

  constructor(private readonly elements: A[]) {
    super();
  }

  public test(actual: any): MatchResult {
    let result = new MatchResult(actual);

    if (!Array.isArray(actual)) {
      result.push(this, [], `Expected an array, but got '${typeof actual}'`);
      return result;
    }

    for (const [i, el] of enumerate(this.elements)) {
      const matcher = Matcher.isMatcher(el) ? el : Match.exact(el);

      const actualResults = actual.map(value => matcher.test(value));

      if (actualResults.every(r => r.hasFailed())) {
        // Couldn't find it
        result.recordFailure({
          path: [`/${i}`],
          message: `Could not find expected element ${i} in the array`,
          matcher,
        });

        for (const [j, r] of enumerate(actualResults)) {
          result = result.compose(`/${i} <=> ${j}`, r);
        }
      }
    }

    return result;
  }
}