import { Matcher, MatchResult } from './matcher';
import { AbsentMatch } from './private/matchers/absent';
import { getType } from './private/type';

/**
 * Partial and special matching during template assertions.
 */
export abstract class Match {
  /**
   * Use this matcher in the place of a field's value, if the field must not be present.
   */
  public static absent(): Matcher {
    return new AbsentMatch('absent');
  }

  /**
   * Matches the specified pattern with the array found in the same relative path of the target.
   * The set of elements (or matchers) must be in the same order as would be found.
   * @param pattern the pattern to match
   */
  public static arrayWith(pattern: any[]): Matcher {
    return new ArrayMatch('arrayWith', pattern);
  }

  /**
   * Matches the specified pattern with the array found in the same relative path of the target.
   * The set of elements (or matchers) must match exactly and in order.
   * @param pattern the pattern to match
   */
  public static arrayEquals(pattern: any[]): Matcher {
    return new ArrayMatch('arrayEquals', pattern, { subsequence: false });
  }

  /**
   * Deep exact matching of the specified pattern to the target.
   * @param pattern the pattern to match
   */
  public static exact(pattern: any): Matcher {
    return new LiteralMatch('exact', pattern, { partialObjects: false });
  }

  /**
   * Matches the specified pattern to an object found in the same relative path of the target.
   * The keys and their values (or matchers) must be present in the target but the target can be a superset.
   * @param pattern the pattern to match
   */
  public static objectLike(pattern: {[key: string]: any}): Matcher {
    return new ObjectMatch('objectLike', pattern);
  }

  /**
   * Matches the specified pattern to an object found in the same relative path of the target.
   * The keys and their values (or matchers) must match exactly with the target.
   * @param pattern the pattern to match
   */
  public static objectEquals(pattern: {[key: string]: any}): Matcher {
    return new ObjectMatch('objectEquals', pattern, { partial: false });
  }

  /**
   * Matches any target which does NOT follow the specified pattern.
   * @param pattern the pattern to NOT match
   */
  public static not(pattern: any): Matcher {
    return new NotMatch('not', pattern);
  }

  /**
   * Matches any string-encoded JSON and applies the specified pattern after parsing it.
   * @param pattern the pattern to match after parsing the encoded JSON.
   */
  public static serializedJson(pattern: any): Matcher {
    return new SerializedJson('serializedJson', pattern);
  }

  /**
   * Matches any non-null value at the target.
   */
  public static anyValue(): Matcher {
    return new AnyMatch('anyValue');
  }

  /**
   * Resolves a join and Matches it.
   */
  public static resolveCfnIntrinsic(pattern: any, options: ResolveCfnIntrinsicOptions = {}, mocks: ResolveCfnIntrinsicMocks = {}): Matcher {
    return new ResolveCfnIntrinsic('resolveCfnIntrinsic', pattern, options, mocks);
  }
}

/**
 * Options when initializing the `LiteralMatch` class.
 */
interface LiteralMatchOptions {
  /**
   * Whether objects nested at any level should be matched partially.
   * @default false
   */
  readonly partialObjects?: boolean;
}

/**
 * A Match class that expects the target to match with the pattern exactly.
 * The pattern may be nested with other matchers that are then deletegated to.
 */
class LiteralMatch extends Matcher {
  private readonly partialObjects: boolean;

  constructor(
    public readonly name: string,
    private readonly pattern: any,
    options: LiteralMatchOptions = {}) {

    super();
    this.partialObjects = options.partialObjects ?? false;

    if (Matcher.isMatcher(this.pattern)) {
      throw new Error('LiteralMatch cannot directly contain another matcher. ' +
        'Remove the top-level matcher or nest it more deeply.');
    }
  }

  public test(actual: any): MatchResult {
    if (Array.isArray(this.pattern)) {
      return new ArrayMatch(this.name, this.pattern, { subsequence: false }).test(actual);
    }

    if (typeof this.pattern === 'object') {
      return new ObjectMatch(this.name, this.pattern, { partial: this.partialObjects }).test(actual);
    }

    const result = new MatchResult(actual);
    if (typeof this.pattern !== typeof actual) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Expected type ${typeof this.pattern} but received ${getType(actual)}`,
      });
      return result;
    }

    if (actual !== this.pattern) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Expected ${this.pattern} but received ${actual}`,
      });
    }

    return result;
  }
}

/**
 * Options when initializing the `ArrayMatch` class.
 */
interface ArrayMatchOptions {
  /**
   * Whether the pattern is a subsequence of the target.
   * A subsequence is a sequence that can be derived from another sequence by deleting
   * some or no elements without changing the order of the remaining elements.
   * @default true
   */
  readonly subsequence?: boolean;
}

/**
 * Match class that matches arrays.
 */
class ArrayMatch extends Matcher {
  private readonly subsequence: boolean;

  constructor(
    public readonly name: string,
    private readonly pattern: any[],
    options: ArrayMatchOptions = {}) {

    super();
    this.subsequence = options.subsequence ?? true;
  }

  public test(actual: any): MatchResult {
    if (!Array.isArray(actual)) {
      return new MatchResult(actual).recordFailure({
        matcher: this,
        path: [],
        message: `Expected type array but received ${getType(actual)}`,
      });
    }
    if (!this.subsequence && this.pattern.length !== actual.length) {
      return new MatchResult(actual).recordFailure({
        matcher: this,
        path: [],
        message: `Expected array of length ${this.pattern.length} but received ${actual.length}`,
      });
    }

    let patternIdx = 0;
    let actualIdx = 0;

    const result = new MatchResult(actual);
    while (patternIdx < this.pattern.length && actualIdx < actual.length) {
      const patternElement = this.pattern[patternIdx];

      const matcher = Matcher.isMatcher(patternElement) ? patternElement : new LiteralMatch(this.name, patternElement);
      const matcherName = matcher.name;
      if (this.subsequence && (matcherName == 'absent' || matcherName == 'anyValue')) {
        // array subsequence matcher is not compatible with anyValue() or absent() matcher. They don't make sense to be used together.
        throw new Error(`The Matcher ${matcherName}() cannot be nested within arrayWith()`);
      }

      const innerResult = matcher.test(actual[actualIdx]);

      if (!this.subsequence || !innerResult.hasFailed()) {
        result.compose(`[${actualIdx}]`, innerResult);
        patternIdx++;
        actualIdx++;
      } else {
        actualIdx++;
      }
    }

    for (; patternIdx < this.pattern.length; patternIdx++) {
      const pattern = this.pattern[patternIdx];
      const element = (Matcher.isMatcher(pattern) || typeof pattern === 'object') ? ' ' : ` [${pattern}] `;
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Missing element${element}at pattern index ${patternIdx}`,
      });
    }

    return result;
  }
}

/**
 * Options when initializing `ObjectMatch` class.
 */
interface ObjectMatchOptions {
  /**
   * Whether the pattern should partially match with the target object.
   * The target object can contain more keys than expected by the pattern.
   * @default true
   */
  readonly partial?: boolean;
}

/**
 * Match class that matches objects.
 */
class ObjectMatch extends Matcher {
  private readonly partial: boolean;

  constructor(
    public readonly name: string,
    private readonly pattern: {[key: string]: any},
    options: ObjectMatchOptions = {}) {

    super();
    this.partial = options.partial ?? true;
  }

  public test(actual: any): MatchResult {
    if (typeof actual !== 'object' || Array.isArray(actual)) {
      return new MatchResult(actual).recordFailure({
        matcher: this,
        path: [],
        message: `Expected type object but received ${getType(actual)}`,
      });
    }

    const result = new MatchResult(actual);
    if (!this.partial) {
      for (const a of Object.keys(actual)) {
        if (!(a in this.pattern)) {
          result.recordFailure({
            matcher: this,
            path: [`/${a}`],
            message: 'Unexpected key',
          });
        }
      }
    }

    for (const [patternKey, patternVal] of Object.entries(this.pattern)) {
      if (!(patternKey in actual) && !(patternVal instanceof AbsentMatch)) {
        result.recordFailure({
          matcher: this,
          path: [`/${patternKey}`],
          message: 'Missing key',
        });
        continue;
      }
      const matcher = Matcher.isMatcher(patternVal) ?
        patternVal :
        new LiteralMatch(this.name, patternVal, { partialObjects: this.partial });
      const inner = matcher.test(actual[patternKey]);
      result.compose(`/${patternKey}`, inner);
    }

    return result;
  }
}

class SerializedJson extends Matcher {
  constructor(
    public readonly name: string,
    private readonly pattern: any,
  ) {
    super();
  };

  public test(actual: any): MatchResult {
    const result = new MatchResult(actual);
    if (getType(actual) !== 'string') {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Expected JSON as a string but found ${getType(actual)}`,
      });
      return result;
    }
    let parsed;
    try {
      parsed = JSON.parse(actual);
    } catch (err) {
      if (err instanceof SyntaxError) {
        result.recordFailure({
          matcher: this,
          path: [],
          message: `Invalid JSON string: ${actual}`,
        });
        return result;
      } else {
        throw err;
      }
    }

    const matcher = Matcher.isMatcher(this.pattern) ? this.pattern : new LiteralMatch(this.name, this.pattern);
    const innerResult = matcher.test(parsed);
    result.compose(`(${this.name})`, innerResult);
    return result;
  }
}

class NotMatch extends Matcher {
  constructor(
    public readonly name: string,
    private readonly pattern: {[key: string]: any}) {

    super();
  }

  public test(actual: any): MatchResult {
    const matcher = Matcher.isMatcher(this.pattern) ? this.pattern : new LiteralMatch(this.name, this.pattern);

    const innerResult = matcher.test(actual);
    const result = new MatchResult(actual);
    if (innerResult.failCount === 0) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: `Found unexpected match: ${JSON.stringify(actual, undefined, 2)}`,
      });
    }
    return result;
  }
}

class AnyMatch extends Matcher {
  constructor(public readonly name: string) {
    super();
  }

  public test(actual: any): MatchResult {
    const result = new MatchResult(actual);
    if (actual == null) {
      result.recordFailure({
        matcher: this,
        path: [],
        message: 'Expected a value but found none',
      });
    }
    return result;
  }
}

/**
 * TODO Doc
 */
export interface ResolveCfnIntrinsicMockResourceAttributes {
  readonly [attribute: string]: string | string[] | number | number [];
}

/**
 * TODO Doc
 */

export interface ResolveCfnIntrinsicMockResources {
  readonly [resourceLogicalId: string]: ResolveCfnIntrinsicMockResourceAttributes
}

/**
 * TODO Doc
 */
export interface ResolveCfnIntrinsicMockPseudoParameters {
  /**
   * Returns the AWS account ID of the account in which the stack is being created
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html#cfn-pseudo-param-accountid
   * @default 123456789012
   */
  readonly awsAccountId?: string;
  /**
   * Returns the list of notification Amazon Resource Names (ARNs) for the current stack.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html#cfn-pseudo-param-notificationarns
   * @default []
   */
  readonly awsNotificationARNs?: string[];
  /**
   * Returns the partition that the resource is in. For standard AWS Regions, the partition is aws.
   * For resources in other partitions, the partition is aws-partitionname.
   * For example, the partition for resources in the China (Beijing and Ningxia) Region is aws-cn
   * and the partition for resources in the AWS GovCloud (US-West) region is aws-us-gov.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html#cfn-pseudo-param-partition
   * @default aws
   */
  readonly awsPartition?: string;
  /**
   * Returns a string representing the Region in which the encompassing resource is being created.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html#cfn-pseudo-param-region
   * @default us-east-1
   */
  readonly awsRegion?: string;
  /**
   * Returns the ID of the stack as specified with the aws cloudformation create-stack command.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html#cfn-pseudo-param-stackid
   * @default arn:aws:cloudformation:us-east-1:123456789012:stack/teststack/51af3dc0-da77-11e4-872e-1234567db123
   */
  readonly awsStackId?: string;
  /**
   * Returns the name of the stack as specified with the aws cloudformation create-stack command.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html#cfn-pseudo-param-stackname
   * @default teststack
   */
  readonly awsStackName?: string;
  /**
   * Returns the suffix for a domain. The suffix is typically amazonaws.com, but might differ by Region.
   * For example, the suffix for the China (Beijing) Region is amazonaws.com.cn.
   *
   * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html#cfn-pseudo-param-urlsuffix
   * @default amazonaws.com
   */
  readonly awsURLSuffix?: string;
}

/**
 * TODO Doc
 */
export interface ResolveCfnIntrinsicMocks {
  /**
   * Mock attribute values of cloudformation resources
   *
   * @default {}
   */
  readonly cfnResources?: ResolveCfnIntrinsicMockResources;
  /**
   * Mock exports of other cloudformation stacks
   *
   * @default {}
   */
  readonly cfnExports?: ResolveCfnIntrinsicMockResourceAttributes;
  /**
   * Overwrite mock values of cloudformation pseudo parameters
   * @default - { see defaults of ResolveCfnIntrinsicMockPseudoParameters }
   */
  readonly cfnPseudoParameters?: ResolveCfnIntrinsicMockPseudoParameters
}

/**
 * TODO Doc
 */
export interface ResolveCfnIntrinsicOptions {
  /**
   * recursivele resolve intrinsic functions?
   * @default true
   */
  readonly recursive?: boolean;
  /**
   * resolve PseudoParameters?
   *
   * @default true
   */
  readonly resolvePseudoParameters?: boolean;
  /**
   * resolve Fn::Join?
   *
   * @default true
   */
  readonly resolveFnJoin?: boolean;
  /**
   * resolve Fn::GetAtt?
   *
   * @default true
   */
  readonly resolveFnGetAtt?: boolean;
  /**
   * resolve Fn::ImportValue?
   *
   * @default true
   */
  readonly resolveFnImportValue?: boolean;
  /**
   * resolve Fn::Select?
   *
   * @default true
   */
  readonly resolveFnSelect?: boolean;
}

class ResolveCfnIntrinsic extends Matcher {

  private static resolveIntrinsic(object: any, options: ResolveCfnIntrinsicOptions, mocks: ResolveCfnIntrinsicMocks): any {
    if (typeof object === 'object') {
      // Handle PseudoParameter
      if ( options.resolvePseudoParameters && ['AWS::AccountId', 'AWS::NotificationARNs', 'AWS::Partition', 'AWS::Region', 'AWS::StackId', 'AWS::StackName', 'AWS::URLSuffix'].includes(object.Ref) ) {
        const pseudoParameter: 'awsAccountId' | 'awsNotificationARNs' | 'awsPartition' | 'awsRegion' | 'awsStackId'| 'awsStackName'| 'awsURLSuffix' = object.Ref.replace('AWS::', 'aws');
        return mocks.cfnPseudoParameters![pseudoParameter];
      }
      // Handle { "Fn::Join" : [ "delimiter", [ comma-delimited list of values ] ] }
      if ( options.resolveFnJoin && object['Fn::Join'] instanceof Array && object['Fn::Join'].length == 2 && object['Fn::Join'][1] instanceof Array ) {
        const delimiter = object['Fn::Join'][0];
        let valuesList = object['Fn::Join'][1];
        if (options.recursive) {
          valuesList = valuesList.map( (attr) => ResolveCfnIntrinsic.resolveIntrinsic(attr, options, mocks));
        }
        valuesList.forEach( (value) => {
          if ( typeof value === 'object' ) {
            throw new Error('Fn::Join valueList are not allowed to contain objects');
          }
        });
        if ( typeof delimiter !== 'string' ) {
          throw new Error('Fn::Join delimiter must be a string value');
        }
        return valuesList.join(delimiter);
      }
      // Handle { "Fn::GetAtt" : [ "logicalNameOfResource", "attributeName" ] }
      //if ( options.resolveFnGetAtt && object['Fn::GetAtt'] instanceof Array ) {
      //  const logicalNameOfResource = object['Fn::GetAtt'][0];
      //  const attributeName = object['Fn::GetAtt'][1];
      //  if ( mocks !== undefined &&
      //    mocks.cfnResources !== undefined &&
      //    mocks?.cfnResources[logicalNameOfResource] !== undefined &&
      //    mocks?.cfnResources[logicalNameOfResource][attributeName] !== undefined ) {
      //    // Return the mock value
      //    return mocks.cfnResources[logicalNameOfResource][attributeName];
      //  }
      //  throw new Error(`Could not resolve { "Fn::GetAtt": [ "${logicalNameOfResource}", "${attributeName}" ] }`);
      //}
      //// Handle { "Fn::ImportValue" : sharedValueToImport }
      //if ( options.resolveFnImportValue && object['Fn::ImportValue'] instanceof object ) {
      //  const sharedValueToImport = object['Fn::ImportValue'];
      //  if ( mocks !== undefined && mocks.cfnExports !== undefined && mocks.cfnExports[sharedValueToImport] !== undefined ) {
      //    return mocks.cfnExports[sharedValueToImport];
      //  }
      //  throw new Error(`Could not resolve { "Fn::ImportValue": "${sharedValueToImport}" }`);
      //}
      // Handle { "Fn::Sub" : [ String, { Var1Name: Var1Value, Var2Name: Var2Value } ] }
      //if ( object['Fn::Sub'] instanceof Array ) {
      //}
      // Handle { "Fn::FindInMap" : [ "MapName", "TopLevelKey", "SecondLevelKey"] }
      //if ( object['Fn::FindInMap'] instanceof Array ) {
      //}
      // Handle { "Fn::GetAZs" : "region" }
      //if ( object['Fn::GetAZs'] !== undefined ) {
      //}
      // Handle { "Fn::Select" : [ index, [ list of objects ] ] }
      //if ( options.resolveFnSelect && object['Fn::Select'] instanceof Array ) {
      //  // Check if the select looks like expected
      //  if ( typeof object['Fn::Select'][0] == 'number' && object['Fn::Select'][1] instanceof Array ) {
      //    if ( options.recursive ) {
      //      return ResolveCfnIntrinsic.resolveIntrinsic(object['Fn::Select'][1][object['Fn::Select'][0]], options, mocks);
      //    }
      //    return object['Fn::Select'][1][object['Fn::Select'][0]];
      //  }
      //}
      for (var property in object) {
        object[property] = ResolveCfnIntrinsic.resolveIntrinsic(object[property], options, mocks);
      }
    }
    return object;
  }

  private readonly options: ResolveCfnIntrinsicOptions;
  private readonly mocks: ResolveCfnIntrinsicMocks;

  constructor(
    public readonly name: string,
    private readonly pattern: any,
    options: ResolveCfnIntrinsicOptions,
    mocks: ResolveCfnIntrinsicMocks,
  ) {
    super();
    this.mocks = {
      cfnExports: mocks.cfnExports ?? {},
      cfnResources: mocks.cfnResources ?? {},
      cfnPseudoParameters: {
        awsAccountId: mocks.cfnPseudoParameters?.awsAccountId ?? '123456789012',
        awsNotificationARNs: mocks.cfnPseudoParameters?.awsNotificationARNs ?? [],
        awsPartition: mocks.cfnPseudoParameters?.awsPartition ?? 'aws',
        awsRegion: mocks.cfnPseudoParameters?.awsRegion ?? 'us-east-1',
        awsStackId: mocks.cfnPseudoParameters?.awsStackId ?? 'arn:aws:cloudformation:us-east-1:123456789012:stack/teststack/51af3dc0-da77-11e4-872e-1234567db123',
        awsStackName: mocks.cfnPseudoParameters?.awsStackName ?? 'teststack',
        awsURLSuffix: mocks.cfnPseudoParameters?.awsURLSuffix ?? 'amazonaws.com',
      },
    };
    this.options = {
      recursive: options.recursive ?? true,
      resolvePseudoParameters: options.resolvePseudoParameters ?? true,
      resolveFnJoin: options.resolveFnJoin ?? true,
      resolveFnGetAtt: options.resolveFnGetAtt ?? true,
      resolveFnImportValue: options.resolveFnImportValue ?? true,
      resolveFnSelect: options.resolveFnSelect ?? true,
    };
  };

  public test(actual: any): MatchResult {
    const result = new MatchResult(actual);

    try {
      const parsed = ResolveCfnIntrinsic.resolveIntrinsic(actual, this.options, this.mocks);
      // eslint-disable-next-line no-console
      console.log(parsed);
      const matcher = Matcher.isMatcher(this.pattern) ? this.pattern : new LiteralMatch(this.name, this.pattern);
      const innerResult = matcher.test(parsed);
      result.compose(`(${this.name})`, innerResult);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      result.recordFailure({
        matcher: this,
        path: [],
        message: '' + e,
      });
    }


    return result;
  }
}