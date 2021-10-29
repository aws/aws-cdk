class Code {
  public static concatAll(...xs: Array<Code | string>) {
    return xs.map(Code.force).reduce((a, b) => a.append(b), new Code(''));
  }

  public static force(x: Code | string): Code {
    if (x instanceof Code) {
      return x;
    }
    return new Code(x);
  }

  constructor(public readonly code: string, public readonly declarations: string[] = []) {
  }

  public append(rhs: Code | string) {
    if (typeof rhs === 'string') {
      return new Code(this.code + rhs, this.declarations);
    }

    // FIXME: Declarations probably need to be deduped
    // FIXME: Declarations probably need to be richer types than just 'string'

    return new Code(this.code + rhs.code, [...this.declarations, ...rhs.declarations]);
  }

  public render(separator = '\n') {
    return this.declarations.join('\n') + separator + this.code;
  }

  public toString() {
    return this.render();
  }
}

// Code('a', ['x']) <+> Code('b', ['y']) ==> Code('ab', ['x', 'y'])
// Code('a', ['x']) <+> Code('b', ['x']) ==> Code('ab', ['x'])