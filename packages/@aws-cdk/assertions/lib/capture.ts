import { Matcher, MatchResult } from './matcher';
import { Type, getType } from './private/type';

/**
 * Capture values while matching templates.
 * Using an instance of this class within a Matcher will capture the matching value.
 * The `as*()` APIs on the instance can be used to get the captured value.
 */
export class Capture extends Matcher {
  public readonly name: string;
  private value: any = null;

  constructor() {
    super();
    this.name = 'Capture';
  }

  public test(actual: any): MatchResult {
    this.value = actual;

    const result = new MatchResult(actual);
    if (actual == null) {
      result.push(this, [], `Can only capture non-nullish values. Found ${actual}`);
    }
    return result;
  }

  /**
   * Retrieve the captured value as a string.
   * An error is generated if no value is captured or if the value is not a string.
   */
  public asString(): string {
    this.checkNotNull();
    if (getType(this.value) === 'string') {
      return this.value;
    }
    this.reportIncorrectType('string');
  }

  /**
   * Retrieve the captured value as a number.
   * An error is generated if no value is captured or if the value is not a number.
   */
  public asNumber(): number {
    this.checkNotNull();
    if (getType(this.value) === 'number') {
      return this.value;
    }
    this.reportIncorrectType('number');
  }

  /**
   * Retrieve the captured value as a boolean.
   * An error is generated if no value is captured or if the value is not a boolean.
   */
  public asBoolean(): boolean {
    this.checkNotNull();
    if (getType(this.value) === 'boolean') {
      return this.value;
    }
    this.reportIncorrectType('boolean');
  }

  /**
   * Retrieve the captured value as an array.
   * An error is generated if no value is captured or if the value is not an array.
   */
  public asArray(): any[] {
    this.checkNotNull();
    if (getType(this.value) === 'array') {
      return this.value;
    }
    this.reportIncorrectType('array');
  }

  /**
   * Retrieve the captured value as a JSON object.
   * An error is generated if no value is captured or if the value is not an object.
   */
  public asObject(): { [key: string]: any } {
    this.checkNotNull();
    if (getType(this.value) === 'object') {
      return this.value;
    }
    this.reportIncorrectType('object');
  }

  private checkNotNull(): void {
    if (this.value == null) {
      throw new Error('No value captured');
    }
  }

  private reportIncorrectType(expected: Type): never {
    throw new Error(`Captured value is expected to be ${expected} but found ${getType(this.value)}. ` +
      `Value is ${JSON.stringify(this.value, undefined, 2)}`);
  }
}