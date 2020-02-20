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

  public sub<K extends {[key in H]: string}>(replacements: K): string;
  public sub<K extends Partial<{[key in H]: string}>>(replacements: K): TemplatedString<Exclude<H, keyof K>>;
  public sub<K extends {[key in H]: string}>(replacements: object): TemplatedString<Exclude<H, keyof K>> | string {
    let tpl = this.template;
    for (const [k, v] of Object.entries(replacements)) {
      tpl = tpl.replace(new RegExp('\\$\\{' + k + '\\}', 'g'), v as string);
    }

    if (tpl.indexOf('${') > -1) {
      return new TemplatedString(tpl);
    }
    return tpl;
  }

  public get() {
    return this.template;
  }

  public toString() {
    return this.template;
  }
}
