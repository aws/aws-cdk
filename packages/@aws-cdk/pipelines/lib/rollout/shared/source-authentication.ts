export class Authentication {
  public static storedToken(tokenName: string): Authentication {
    return new Authentication(tokenName);
  }

  protected constructor(public readonly tokenName: string) {
  }
}