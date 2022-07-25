/**
 * An EventBridge pattern matcher
 *
 */
export interface IMatcher {
  /**
   * Produces the final representation, expected by EventBrige.
   * For example: ["foo"], [{ "prefix": "bar" }], [{ "numeric": [ ">", 0, "<=", 5 ] }] etc
   */
  toEventBridgeMatcher(): any[];
}

/**
 * A matcher for order comparisons with numeric values
 */
export interface INumericMatcher extends IMatcher {}

class NullValueMatcher implements IMatcher {
  toEventBridgeMatcher() {
    return [null];
  }
}

class ExistsMatcher implements IMatcher {
  toEventBridgeMatcher() {
    return [{ exists: true }];
  }
}

class DoesNotExistMatcher implements IMatcher {
  toEventBridgeMatcher() {
    return [{ exists: false }];
  }
}

class ExactStringMatcher implements IMatcher {
  constructor(private readonly value: string) { }

  toEventBridgeMatcher() {
    return [this.value];
  }
}

class PrefixMatcher implements IMatcher {
  constructor(private readonly value: string) { }

  toEventBridgeMatcher() {
    return [{ prefix: this.value }];
  }
}

class CidrMatcher implements IMatcher {
  constructor(private readonly value: string) {
    const ipv4Regex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/igm;
    const ipv6Regex = /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/igm;

    if (!ipv4Regex.test(value) && !ipv6Regex.test(value)) {
      throw new Error(`Invalid IP address range: ${value}`);
    }
  }

  toEventBridgeMatcher() {
    return [{ cidr: this.value }];
  }
}

class AnythingButMatcher implements IMatcher {
  constructor(private readonly values: any[]) {
    if (values.length === 0) {
      throw new Error('anythingBut matchers must be non-empty lists');
    }

    if (!(this.allNumbers() || this.allStrings())) {
      throw new Error(`anythingBut matchers must be lists that contain only strings or only numbers. Got: ${values}`);
    }
  }

  toEventBridgeMatcher() {
    return [{ 'anything-but': this.values }];
  }

  private allStrings(): boolean {
    return this.values.every(v => typeof (v) === 'string');
  }

  private allNumbers(): boolean {
    return this.values.every(v => typeof (v) === 'number');
  }
}

class AnythingButPrefixMatcher implements IMatcher {
  constructor(private readonly prefix: string) {}

  toEventBridgeMatcher(): any[] {
    return [{ 'anything-but': { prefix: this.prefix } }];
  }
}

class LessThanMatcher implements INumericMatcher {
  constructor(private readonly value: number) { }

  toEventBridgeMatcher() {
    return [{ numeric: ['<', this.value] }];
  }
}

class LessThanOrEqualMatcher implements INumericMatcher {
  constructor(private readonly value: number) { }

  toEventBridgeMatcher() {
    return [{ numeric: ['<=', this.value] }];
  }
}

class GreaterThanMatcher implements INumericMatcher {
  constructor(private readonly value: number) { }

  toEventBridgeMatcher() {
    return [{ numeric: ['>', this.value] }];
  }
}

class GreaterThanOrEqualMatcher implements INumericMatcher {
  constructor(private readonly value: number) { }

  toEventBridgeMatcher() {
    return [{ numeric: ['>=', this.value] }];
  }
}

class EqualMatcher implements INumericMatcher {
  constructor(private readonly value: number) { }

  toEventBridgeMatcher() {
    return [{ numeric: ['=', this.value] }];
  }
}

class IntervalMatcher implements IMatcher {
  constructor(
    private readonly lower: number,
    private readonly uppper: number,
  ) {
    if (lower > uppper) {
      throw new Error(`Invalid interval: [${lower}, ${uppper}]`);
    }
  }

  toEventBridgeMatcher() {
    return [{ numeric: ['>=', this.lower, '<=', this.uppper] }];
  }
}

class NumericMatcher implements IMatcher {
  constructor(private readonly matchers: INumericMatcher[]) {
    if (matchers.length === 0) {
      throw new Error('numeric matchers must be non-empty lists');
    }
  }

  toEventBridgeMatcher(): any {
    return [{
      numeric: this.matchers
        .flatMap(m => m.toEventBridgeMatcher())
        .flatMap(m => m.numeric),
    }];
  }
}

class AnyOfMatcher implements IMatcher {
  constructor(private readonly matchers: IMatcher[]) {}

  toEventBridgeMatcher(): any[] {
    return this.matchers.flatMap(m => m.toEventBridgeMatcher());
  }
}

/**
 * A collection of matchers for constructing event patterns
 */
export class Matchers {
  /**
   * Matches a null value in the JSON of the event
   */
  static nullValue(): IMatcher {
    return new NullValueMatcher();
  }

  /**
 * Matches when the field is absent from the JSON of the event
 */
  static exists(): IMatcher {
    return new ExistsMatcher();
  }

  /**
 * Matches when the field is present in the JSON of the event
 */
  static doesNotExist(): IMatcher {
    return new DoesNotExistMatcher();
  }

  /**
 * Matches a string, exactly, in the JSON of the event
 */
  static exactString(value: string): IMatcher {
    return new ExactStringMatcher(value);
  }

  /**
 * Matches strings with the given prefix in the JSON of the event
 */
  static prefix(value: string): IMatcher {
    return new PrefixMatcher(value);
  }

  /**
   * Matches IPv4 and IPv6 network addresses using the Classless Inter-Domain Routing (CIDR) format
   */
  static cidr(range: string): IMatcher {
    return new CidrMatcher(range);
  }

  /**
   * Matches IPv4 and IPv6 network addresses using the Classless Inter-Domain Routing (CIDR) format.
   * Alias of cidr().
   */
  static ipAddressRange(range: string): IMatcher {
    return Matchers.cidr(range);
  }

  /**
   * Matches anything except what's provided in the rule. The list of provided values must contain
   * only strings, only numbers or be a single prefix matcher.
   */
  static anythingBut(...values: any[]): IMatcher {
    return new AnythingButMatcher(values);
  }

  /**
   * Matches numbers less than the provided value
   */
  static lessThan(value: number): IMatcher {
    return new LessThanMatcher(value);
  }

  /**
   * Matches numbers greater than or equal to the provided value
   */
  static lessThanOrEqual(value: number): IMatcher {
    return new LessThanOrEqualMatcher(value);
  }

  /**
   * Matches numbers greater than the provided value
   */
  static greaterThan(value: number): IMatcher {
    return new GreaterThanMatcher(value);
  }

  /**
   * Matches numbers greater than or equal to the provided value
   */
  static greaterThanOrEqual(value: number): IMatcher {
    return new GreaterThanOrEqualMatcher(value);
  }

  /**
   * Matches numbers equal to the provided value
   */
  static equal(value: number): IMatcher {
    return new EqualMatcher(value);
  }

  /**
   * Matches numbers inside a closed numeric interval. Equivalent to:
   * 
   *    Matchers.numeric(Matchers.greaterThanOrEqual(lower), Matchers.lessThanOrEqual(upper))
   *
   * @param lower Lower bound (inclusive)
   * @param upper Upper bound (inclusive)
   */
  static interval(lower: number, upper: number): IMatcher {
    return new IntervalMatcher(lower, upper);
  }

  /**
   * Matches a number that satisfy all the provided matchers. This normally
   * used when you want to match a numeric interval, which can be inclusive or
   * exclusive on either side.
   */
  static numeric(...matchers: INumericMatcher[]): IMatcher {
    return new NumericMatcher(matchers);
  }

  /**
   * Matches an event if any of the provided matchers does.
   */
  static anyOf(...matchers: IMatcher[]): IMatcher {
    return new AnyOfMatcher(matchers);
  }

  /**
   * Matches any string that doesn't start with the given prefix.
   */
  static anythingButPrefix(prefix: string): IMatcher {
    return new AnythingButPrefixMatcher(prefix);
  }
}

/**
 * Events in Amazon CloudWatch Events are represented as JSON objects. For more
 * information about JSON objects, see RFC 7159.
 *
 * **Important**: this class can only be used with a `Rule` class. In particular,
 * do not use it with `CfnRule` class: your pattern will not be rendered
 * correctly. In a `CfnRule` class, write the pattern as you normally would when
 * directly writing CloudFormation.
 *
 * Rules use event patterns to select events and route them to targets. A
 * pattern either matches an event or it doesn't. Event patterns are represented
 * as JSON objects with a structure that is similar to that of events.
 *
 * It is important to remember the following about event pattern matching:
 *
 * - For a pattern to match an event, the event must contain all the field names
 *   listed in the pattern. The field names must appear in the event with the
 *   same nesting structure.
 *
 * - Other fields of the event not mentioned in the pattern are ignored;
 *   effectively, there is a ``"*": "*"`` wildcard for fields not mentioned.
 *
 * - The matching is exact (character-by-character), without case-folding or any
 *   other string normalization.
 *
 * - The values being matched follow JSON rules: Strings enclosed in quotes,
 *   numbers, and the unquoted keywords true, false, and null.
 *
 * - Number matching is at the string representation level. For example, 300,
 *   300.0, and 3.0e2 are not considered equal.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/CloudWatchEventsandEventPatterns.html
 */
export interface EventPattern {
  /**
   * By default, this is set to 0 (zero) in all events.
   *
   * @default - No filtering on version
   */
  readonly version?: string[] | IMatcher;

  /**
   * A unique value is generated for every event. This can be helpful in
   * tracing events as they move through rules to targets, and are processed.
   *
   * @default - No filtering on id
   */
  readonly id?: string[] | IMatcher;

  /**
   * Identifies, in combination with the source field, the fields and values
   * that appear in the detail field.
   *
   * Represents the "detail-type" event field.
   *
   * @default - No filtering on detail type
   */
  readonly detailType?: string[] | IMatcher;

  /**
   * Identifies the service that sourced the event. All events sourced from
   * within AWS begin with "aws." Customer-generated events can have any value
   * here, as long as it doesn't begin with "aws." We recommend the use of
   * Java package-name style reverse domain-name strings.
   *
   * To find the correct value for source for an AWS service, see the table in
   * AWS Service Namespaces. For example, the source value for Amazon
   * CloudFront is aws.cloudfront.
   *
   * @see http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html#genref-aws-service-namespaces
   * @default - No filtering on source
   */
  readonly source?: string[] | IMatcher;

  /**
   * The 12-digit number identifying an AWS account.
   *
   * @default - No filtering on account
   */
  readonly account?: string[] | IMatcher;

  /**
   * The event timestamp, which can be specified by the service originating
   * the event. If the event spans a time interval, the service might choose
   * to report the start time, so this value can be noticeably before the time
   * the event is actually received.
   *
   * @default - No filtering on time
   */
  readonly time?: string[] | IMatcher;

  /**
   * Identifies the AWS region where the event originated.
   *
   * @default - No filtering on region
   */
  readonly region?: string[] | IMatcher;

  /**
   * This JSON array contains ARNs that identify resources that are involved
   * in the event. Inclusion of these ARNs is at the discretion of the
   * service.
   *
   * For example, Amazon EC2 instance state-changes include Amazon EC2
   * instance ARNs, Auto Scaling events include ARNs for both instances and
   * Auto Scaling groups, but API calls with AWS CloudTrail do not include
   * resource ARNs.
   *
   * @default - No filtering on resource
   */
  readonly resources?: string[] | IMatcher;

  /**
   * A JSON object, whose content is at the discretion of the service
   * originating the event.
   *
   * @default - No filtering on detail
   */
  readonly detail?: {[key: string]: any};
}
