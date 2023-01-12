import { captureStackTrace, IResolvable, IResolveContext, Token } from '@aws-cdk/core';

type ComparisonOperator = '>' | '>=' | '<' | '<=' | '=';

/**
 * Options for how to construct matchers
 */
interface MatchOptions {
  /**
   * Whether the list of matchers should be merged into a single matcher
   */
  readonly mergeMatchers: boolean;
}

/**
 * An event pattern matcher
 */
export class Match implements IResolvable {
  /**
   * Matches a null value in the JSON of the event
   */
  public static nullValue(): string[] {
    return this.fromObjects([null]);
  }

  /**
   * Matches when the field is present in the JSON of the event
   */
  public static exists(): string[] {
    return this.fromObjects([{ exists: true }]);
  }

  /**
   * Matches when the field is absent from the JSON of the event
   */
  public static doesNotExist(): string[] {
    return this.fromObjects([{ exists: false }]);
  }

  /**
   * Matches a string, exactly, in the JSON of the event
   */
  public static exactString(value: string): string[] {
    return this.fromObjects([value]);
  }

  /**
   * Matches a string, regardless of case, in the JSON of the event
   */
  public static equalsIgnoreCase(value: string): string[] {
    return this.fromObjects([{ 'equals-ignore-case': value }]);
  }

  /**
   * Matches strings with the given prefix in the JSON of the event
   */
  public static prefix(value: string): string[] {
    return this.fromObjects([{ prefix: value }]);
  }

  /**
   * Matches strings with the given suffix in the JSON of the event
   */
  public static suffix(value: string): string[] {
    return this.fromObjects([{ suffix: value }]);
  }

  /**
   * Matches IPv4 and IPv6 network addresses using the Classless Inter-Domain Routing (CIDR) format
   */
  public static cidr(range: string): string[] {
    const ipv4Regex = /^([0-9]{1,3}\.){3}[0-9]{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/igm;
    const ipv6Regex = /^s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]d|1dd|[1-9]?d)(.(25[0-5]|2[0-4]d|1dd|[1-9]?d)){3}))|:)))(%.+)?s*(\/([0-9]|[1-9][0-9]|1[0-1][0-9]|12[0-8]))?$/igm;

    if (!ipv4Regex.test(range) && !ipv6Regex.test(range)) {
      throw new Error(`Invalid IP address range: ${range}`);
    }

    return this.fromObjects([{ cidr: range }]);
  }

  /**
   * Matches IPv4 and IPv6 network addresses using the Classless Inter-Domain Routing (CIDR) format.
   * Alias of `cidr()`.
   */
  public static ipAddressRange(range: string): string[] {
    return Match.cidr(range);
  }

  /**
   * Matches anything except what's provided in the rule. The list of provided values must contain
   * only strings or only numbers.
   */
  public static anythingBut(...values: any[]): string[] {
    if (values.length === 0) {
      throw new Error('anythingBut matchers must be non-empty lists');
    }

    const allNumbers = values.every(v => typeof (v) === 'number');
    const allStrings = values.every(v => typeof (v) === 'string');

    if (!(allNumbers || allStrings)) {
      throw new Error('anythingBut matchers must be lists that contain only strings or only numbers.');
    }

    return this.fromObjects([{ 'anything-but': values }]);
  }

  /**
   * Matches any string that doesn't start with the given prefix.
   */
  public static anythingButPrefix(prefix: string): string[] {
    return this.fromObjects([{ 'anything-but': { prefix: prefix } }]);
  }

  /**
   * Matches numbers greater than the provided value
   */
  public static greaterThan(value: number): string[] {
    return this.numeric('>', value);
  }

  /**
   * Matches numbers greater than, or equal to, the provided value
   */
  public static greaterThanOrEqual(value: number): string[] {
    return this.numeric('>=', value);
  }

  /**
   * Matches numbers less than the provided value
   */
  public static lessThan(value: number): string[] {
    return this.numeric('<', value);
  }

  /**
   * Matches numbers less than, or equal to, the provided value
   */
  public static lessThanOrEqual(value: number): string[] {
    return this.numeric('<=', value);
  }

  /**
   * Matches numbers equal to the provided value
   */
  public static equal(value: number): string[] {
    return this.numeric('=', value);
  }

  /**
   * Matches numbers inside a closed numeric interval. Equivalent to:
   *
   *    Match.allOf(Match.greaterThanOrEqual(lower), Match.lessThanOrEqual(upper))
   *
   * @param lower Lower bound (inclusive)
   * @param upper Upper bound (inclusive)
   */
  public static interval(lower: number, upper: number): string[] {
    if (lower > upper) {
      throw new Error(`Invalid interval: [${lower}, ${upper}]`);
    }

    return Match.allOf(Match.greaterThanOrEqual(lower), Match.lessThanOrEqual(upper));
  }

  /**
   * Matches an event if any of the provided matchers do. Only numeric matchers are accepted.
   */
  public static allOf(...matchers: any[]): string[] {
    if (matchers.length === 0) {
      throw new Error('A list of matchers must contain at least one element.');
    }

    return this.fromMergedObjects(matchers);
  }

  /**
   * Matches an event if any of the provided matchers does.
   */
  public static anyOf(...matchers: any[]): string[] {
    if (matchers.length === 0) {
      throw new Error('A list of matchers must contain at least one element.');
    }
    return this.fromObjects(matchers);
  }

  private static numeric(operator: ComparisonOperator, value: number): string[] {
    return this.fromObjects([{ numeric: [operator, value] }]);
  }

  private static fromObjects(values: any[]): string[] {
    return new Match(values, { mergeMatchers: false }).asList();
  }

  private static fromMergedObjects(values: any[]): string[] {
    return new Match(values, { mergeMatchers: true }).asList();
  }

  public readonly creationStack: string[];

  private constructor(private readonly matchers: any[],
    private readonly options: MatchOptions) {
    this.creationStack = captureStackTrace();
  }

  resolve(context: IResolveContext): any {
    const matchers = this.matchers.flatMap(matcher => context.resolve(matcher));
    return this.options.mergeMatchers ? this.merge(matchers) : matchers;
  }

  private merge(matchers: any[]): any {
    // This is the only supported case for merging at the moment.
    // We can generalize this logic if EventBridge starts supporting more cases in the future.
    if (!matchers.every(matcher => matcher?.numeric)) {
      throw new Error('Only numeric matchers can be merged into a single matcher.');
    }

    return [{ numeric: matchers.flatMap(matcher => matcher.numeric) }];
  }

  toString(): string {
    return Token.asString(this);
  }

  /**
   * A representation of this matcher as a list of strings
   */
  asList(): string[] {
    return Token.asList(this);
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
  readonly version?: string[];

  /**
   * A unique value is generated for every event. This can be helpful in
   * tracing events as they move through rules to targets, and are processed.
   *
   * @default - No filtering on id
   */
  readonly id?: string[];

  /**
   * Identifies, in combination with the source field, the fields and values
   * that appear in the detail field.
   *
   * Represents the "detail-type" event field.
   *
   * @default - No filtering on detail type
   */
  readonly detailType?: string[];

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
  readonly source?: string[];

  /**
   * The 12-digit number identifying an AWS account.
   *
   * @default - No filtering on account
   */
  readonly account?: string[];

  /**
   * The event timestamp, which can be specified by the service originating
   * the event. If the event spans a time interval, the service might choose
   * to report the start time, so this value can be noticeably before the time
   * the event is actually received.
   *
   * @default - No filtering on time
   */
  readonly time?: string[];

  /**
   * Identifies the AWS region where the event originated.
   *
   * @default - No filtering on region
   */
  readonly region?: string[];

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
  readonly resources?: string[];

  /**
   * A JSON object, whose content is at the discretion of the service
   * originating the event.
   *
   * @default - No filtering on detail
   */
  readonly detail?: { [key: string]: any };
}
