import { ABSENT } from './vendored/assert';

/**
 * Partial and special matching during template assertions
 */
export abstract class Match {
  /**
   * Use this matcher in the place of a field's value, if the field must not be present.
   */
  public static absentProperty(): string {
    return ABSENT;
  }

  public static arrayWith(pattern: any[]): Match {
    return new ArrayWithMatch(pattern);
  }

  public static objectLike(pattern: {[key: string]: any}): Match {
    return new ObjectLikeMatch(pattern);
  }

  public static isMatcher(x: any): x is Match {
    return x && x instanceof Match;
  }

  public abstract test(actual: any): boolean;
}

export class ExactMatch extends Match {
  constructor(private readonly pattern: any) {
    super();

    if (Match.isMatcher(this.pattern)) {
      throw new Error('ExactMatch cannot be nested with another matcher at the top level. Deeper nesting is allowed.');
    }
  }

  public test(actual: any): boolean {
    if (Array.isArray(actual) !== Array.isArray(this.pattern)) {
      return false;
    }

    if (Array.isArray(actual)) {
      if (this.pattern.length !== actual.length) {
        return false;
      }

      for (let i = 0; i < this.pattern.length; i++) {
        const p = this.pattern[i];
        const matcher = Match.isMatcher(p) ? p : new ExactMatch(p);
        if (!matcher.test(actual[i])) return false;
      }

      return true;
    }

    if ((typeof actual === 'object') !== (typeof this.pattern === 'object')) {
      return false;
    }

    if (typeof this.pattern === 'object') {
      const patternKeys = Object.keys(this.pattern).sort();
      const actualKeys = Object.keys(actual).sort();

      const sameKeys = new ExactMatch(patternKeys).test(actualKeys);
      if (!sameKeys) return false;

      const objectMatch = new ObjectLikeMatch(this.pattern).test(actual);
      if (!objectMatch) return false;

      return true;
    }

    if (actual !== this.pattern) {
      return false;
    }

    return true;
  }
}

export class ArrayWithMatch extends Match {
  constructor(private readonly pattern: any[]) {
    super();
  }

  public test(actual: any): boolean {
    if (!Array.isArray(actual)) return false;
    if (this.pattern.length > actual.length) return false;

    let patternIdx = 0;
    let actualIdx = 0;

    while (patternIdx < this.pattern.length && actualIdx < actual.length) {
      let patternElement = this.pattern[patternIdx];
      let matcher = Match.isMatcher(patternElement) ? patternElement : new ExactMatch(patternElement);
      const m = matcher.test(actual[actualIdx]);
      if (m) {
        patternIdx++;
      } else {
        actualIdx++;
      }
    }

    if (patternIdx === this.pattern.length) {
      return true;
    }
    return false;
  }
}

export class ObjectLikeMatch extends Match {
  constructor(private readonly pattern: {[key: string]: any}) {
    super();
  }

  public test(actual: any): boolean {
    if (typeof actual !== 'object') return false;

    for (const [patternKey, patternVal] of Object.entries(this.pattern)) {
      if (!(patternKey in actual)) return false;
      const matcher = Match.isMatcher(patternVal) ? patternVal : new ExactMatch(patternVal);
      if (!matcher.test(actual[patternKey])) return false;
    }

    return true;
  }
}