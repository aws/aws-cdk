import { Matcher, MatchResult } from '@aws-cdk/assertions';

export function stringLike(pattern: string) {
  return new StringLike(pattern);
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
      throw new Error(`Expected string but found ${typeof(actual)}`);
    }
    const re = new RegExp(`^${this.pattern.split('*').map(escapeRegex).join('.*')}$`);

    const result = new MatchResult(actual);
    if (!re.test(actual)) {
      result.push(this, [], `Looking for string with pattern "${this.pattern}" but found "${actual}"`);
    }
    return result;
  }
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}