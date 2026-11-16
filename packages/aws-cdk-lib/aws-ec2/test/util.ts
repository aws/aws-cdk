import type { IConstruct } from 'constructs';
import { Matcher, MatchResult } from '../../assertions';
import * as cdk from '../../core';

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

/**
 * Acknowledge validation rules that fire on aws-dynamodb test infrastructure patterns.
 */
export function acknowledgeTestValidationRules(scope: IConstruct) {
  cdk.Validations.of(scope).acknowledge(
    { id: 'CloudFormation-Validate::W2508', reason: "The default CIDR range for NAT instances is 0.0.0.0/0. The tests don't override it because they're testing other VPC/NAT behaviors (subnet placement, routing, etc.), not the security group configuration" },
    { id: 'CloudFormation-Validate::E3628', reason: 'The exact combination of instance type and region used in NAT instances is not important for these tests' },
  );
}
