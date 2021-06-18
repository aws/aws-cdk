import { Match } from '../match';
import { LiteralMatch } from './literal';

export class ArrayWithMatch extends Match {
  constructor(private readonly pattern: any[]) {
    super();
  }

  public test(actual: any): boolean {
    if (this.pattern.length > actual.length) return false;

    let patternIdx = 0;
    let actualIdx = 0;

    while (patternIdx < this.pattern.length && actualIdx < actual.length) {
      let patternElement = this.pattern[patternIdx];
      let matcher = Match.isMatcher(patternElement) ? patternElement : new LiteralMatch(patternElement);
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