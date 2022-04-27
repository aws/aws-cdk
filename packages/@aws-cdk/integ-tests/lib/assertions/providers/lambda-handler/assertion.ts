/* eslint-disable no-console */
import * as assert from 'assert';
import { CustomResourceHandler } from './base';
import { AssertionRequest, AssertionResult } from './types';

export class AssertionHandler extends CustomResourceHandler<AssertionRequest, AssertionResult> {
  protected async processEvent(request: AssertionRequest): Promise<AssertionResult | undefined> {
    let result: AssertionResult;
    switch (request.assertionType) {
      case 'equals':
        console.log(`Testing equality between ${JSON.stringify(request.actual)} and ${JSON.stringify(request.expected)}`);
        try {
          assert.deepStrictEqual(request.actual, request.expected);
          result = { data: { status: 'pass' } };
        } catch (e) {
          if (e instanceof assert.AssertionError) {
            result = {
              data: {
                status: 'fail',
                message: e.message,
              },
            };
          } else {
            throw e;
          }
        }
        break;
      default:
        throw new Error(`Unsupported query type ${request.assertionType}`);
    }

    return result;
  }
}
