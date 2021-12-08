import { Match } from '.';
import { Matcher, MatchResult } from './matcher';
import { Type, getType } from './private/type';

/**
 * Capture values while matching templates.
 * Using an instance of this class within a Matcher will capture the matching value.
 * The `as*()` APIs on the instance can be used to get the captured value.
 */
export class Capture extends Matcher {
  public readonly name: string;
  /** @internal */
  public _captured: any[] = [];
  private idx = 0;

  /**
   * Initialize a new capture
   * @param pattern a nested pattern or Matcher.
   * If a nested pattern is provided `objectLike()` matching is applied.
   */
  constructor(private readonly pattern?: any) {
    super();
    this.name = 'Capture';
  }

  public test(actual: any): MatchResult {
    const result = new MatchResult(actual);
    if (actual == null) {
      return result.recordFailure({
        matcher: this,
        path: [],
        message: `Can only capture non-nullish values. Found ${actual}`,
      });
    }

    if (this.pattern !== undefined) {
      const innerMatcher = Matcher.isMatcher(this.pattern) ? this.pattern : Match.objectLike(this.pattern);
      const innerResult = innerMatcher.test(actual);
      if (innerResult.hasFailed()) {
        return innerResult;
      }
    }

    result.recordCapture({ capture: this, value: actual });
    return result;
  }

  /**
   * When multiple results are captured, move the iterator to the next result.
   * @returns true if another capture is present, false otherwise
   */
  public next(): boolean {
    if (this.idx < this._captured.length - 1) {
      this.idx++;
      return true;
    }
    return false;
  }

  /**
   * Retrieve the captured value as a string.
   * An error is generated if no value is captured or if the value is not a string.
   */
  public asString(): string {
    this.validate();
    const val = this._captured[this.idx];
    if (getType(val) === 'string') {
      return val;
    }
    this.reportIncorrectType('string');
  }

  /**
   * Retrieve the captured value as a number.
   * An error is generated if no value is captured or if the value is not a number.
   */
  public asNumber(): number {
    this.validate();
    const val = this._captured[this.idx];
    if (getType(val) === 'number') {
      return val;
    }
    this.reportIncorrectType('number');
  }

  /**
   * Retrieve the captured value as a boolean.
   * An error is generated if no value is captured or if the value is not a boolean.
   */
  public asBoolean(): boolean {
    this.validate();
    const val = this._captured[this.idx];
    if (getType(val) === 'boolean') {
      return val;
    }
    this.reportIncorrectType('boolean');
  }

  /**
   * Retrieve the captured value as an array.
   * An error is generated if no value is captured or if the value is not an array.
   */
  public asArray(): any[] {
    this.validate();
    const val = this._captured[this.idx];
    if (getType(val) === 'array') {
      return val;
    }
    this.reportIncorrectType('array');
  }

  /**
   * Retrieve the captured value as a JSON object.
   * An error is generated if no value is captured or if the value is not an object.
   */
  public asObject(): { [key: string]: any } {
    this.validate();
    const val = this._captured[this.idx];
    if (getType(val) === 'object') {
      return val;
    }
    this.reportIncorrectType('object');
  }

  private validate(): void {
    if (this._captured.length === 0) {
      throw new Error('No value captured');
    }
  }

  private reportIncorrectType(expected: Type): never {
    throw new Error(`Captured value is expected to be ${expected} but found ${getType(this._captured[this.idx])}. ` +
      `Value is ${JSON.stringify(this._captured[this.idx], undefined, 2)}`);
  }
}