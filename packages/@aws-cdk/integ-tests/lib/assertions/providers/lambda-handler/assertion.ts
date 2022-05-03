/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Match } from '@aws-cdk/assertions/lib/helpers-internal';
import { CustomResourceHandler } from './base';
import { AssertionResult, AssertionRequest } from './types';

export class AssertionHandler extends CustomResourceHandler<AssertionRequest, AssertionResult> {
  protected async processEvent(request: AssertionRequest): Promise<AssertionResult | undefined> {
    let actual = request.actual;
    const expected = decodeCall(request.expected);
    let result: AssertionResult;
    let matcher;
    console.log(`Testing equality between ${JSON.stringify(request.actual)} and ${JSON.stringify(request.expected)}`);

    switch (request.assertionType) {
      case 'objectLike':
        if (typeof actual === 'string') {
          actual = JSON.parse(actual);
        }
        matcher = Match.objectLike(expected);
        break;
      case 'equals':
        matcher = Match.exact(expected);
        break;
      case 'arrayWith':
        matcher = Match.arrayWith(expected);
        break;
      default:
        throw new Error(`Unsupported query type ${request.assertionType}`);
    }

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

function decodeCall(call: string | undefined) {
  if (!call) { return undefined; }
  try {
    return JSON.parse(call);
  } catch (e) {
    return call;
  }
}
