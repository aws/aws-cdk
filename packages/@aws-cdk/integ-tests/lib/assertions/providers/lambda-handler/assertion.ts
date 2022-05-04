/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Match, Matcher } from '@aws-cdk/assertions/lib/helpers-internal';
import { CustomResourceHandler } from './base';
import { AssertionResult, AssertionRequest } from './types';

export class AssertionHandler extends CustomResourceHandler<AssertionRequest, AssertionResult> {
  protected async processEvent(request: AssertionRequest): Promise<AssertionResult | undefined> {
    let actual = decodeCall(request.actual);
    const expected = decodeCall(request.expected);
    let result: AssertionResult;
    const matcher = new MatchCreator(expected).getMatcher();
    console.log(`Testing equality between ${JSON.stringify(request.actual)} and ${JSON.stringify(request.expected)}`);

    const matchResult = matcher.test(actual);
    matchResult.finished();
    if (matchResult.hasFailed()) {
      result = {
        data: JSON.stringify({
          status: 'fail',
          message: [
            ...matchResult.toHumanStrings(),
            JSON.stringify(matchResult.target, undefined, 2),
          ].join('\n'),
        }),
      };
      if (request.reportFailure) {
        throw new Error(result.data);
      }
    } else {
      result = {
        data: JSON.stringify({
          status: 'pass',
        }),
      };
    }

    return result;
  }
}


class MatchCreator {
  private readonly type: 'arrayWith' | 'objectLike' | 'exact' | 'stringLikeRegexp';
  private readonly parsedObj: any;
  constructor(obj: { [key: string]: any }) {
    switch (Object.keys(obj)[0]) {
      case '$ObjectLike':
        this.type = 'objectLike';
        this.parsedObj = obj.$ObjectLike;
        break;
      case '$ArrayWith':
        this.type = 'arrayWith';
        this.parsedObj = obj.$ArrayWith;
        break;
      case '$Exact':
        this.type = 'exact';
        this.parsedObj = obj.$Exact;
        break;
      case '$StringLike':
        this.type = 'stringLikeRegexp';
        this.parsedObj = obj.$StringLike;
        break;
      default:
        this.type = 'exact';
        this.parsedObj = obj;
    }
  }

  /**
   * Return a Matcher that can be tested against the actual results.
   * This will convert the encoded matchers into their corresponding
   * assertions matcher.
   *
   * For example:
   *
   * ExpectedResult.objectLike({
   *   Messages: [{
   *     Body: Match.objectLike({
   *       Elements: Match.arrayWith([{ Asdf: 3 }]),
   *     }),
   *   }],
   * });
   *
   * Will be encoded as:
   * {
   *   $ObjectLike: {
   *     Messages: [{
   *       Body: {
   *         $ObjectLike: {
   *           Elements: {
   *             $ArrayWith: [{ Asdf: 3 }],
   *           },
   *         },
   *       },
   *     }],
   *   },
   * }
   *
   * Which can then be parsed by this function. For each key (recursively)
   * the parser will check if the value has one of the encoded matchers as a key
   * and if so, it will set the value as the Matcher. So,
   *
   * {
   *   Body: {
   *     $ObjectLike: {
   *       Elements: {
   *         $ArrayWith: [{ Asdf: 3 }],
   *       },
   *     },
   *   },
   * }
   *
   * Will be converted to
   * {
   *   Body: Match.objectLike({
   *     Elements: Match.arrayWith([{ Asdf: 3 }]),
   *   }),
   * }
   */
  public getMatcher(): Matcher {
    try {
      const final = JSON.parse(JSON.stringify(this.parsedObj), function(_k, v) {
        const nested = Object.keys(v)[0];
        switch (nested) {
          case '$ArrayWith':
            return Match.arrayWith(v[nested]);
          case '$ObjectLike':
            return Match.objectLike(v[nested]);
          case '$StringLike':
            return Match.stringLikeRegexp(v[nested]);
          default:
            return v;
        }
      });
      return Match[this.type](final);
    } catch {
      return Match[this.type](this.parsedObj);
    }
  }
}

function decodeCall(call?: string) {
  if (!call) { return undefined; }
  try {
    const parsed = JSON.parse(call);
    return parsed;
  } catch (e) {
    return call;
  }
}
