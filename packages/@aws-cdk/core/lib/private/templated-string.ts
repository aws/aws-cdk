/**
 * String template with ${Placeholders}
 *
 * The placeholders can be progressively substituted out for actual values.
 *
 * The same string is substituted differently in the CloudFormation template
 * (using Tokens) and the Asset Manifest (where it retains asset placeholders).
 */
export class TemplatedString<H extends string> {
  constructor(private readonly template: string) {
  }

  public sub<K extends Partial<{[key in H]: string}>>(replacements: K): TemplatedString<Exclude<H, keyof K>> {
    let tpl = this.template;
    for (const [k, v] of Object.entries(replacements)) {
      tpl = tpl.replace(new RegExp('\\$\\{' + k + '\\}', 'g'), v as string);
    }

    return new TemplatedString(tpl);
  }

  /**
   * Get the inner string out, but only if there are no replacements left
   *
   * The return type of 'unknown' will prevent assigning this where 'string' is
   * expected.
   */
  public get(): H extends never ? string : unknown {
    return this.template as any;
  }

  public toString() {
    return this.template;
  }
}
