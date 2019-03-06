import cdk = require('@aws-cdk/cdk');
import { RegionInfo } from './region-info';

/**
 * A Token that rocudes a value from looking up a RegionInfo fact based on the resolution context's stack region.
 */
export class RegionInfoToken extends cdk.Token {
  /**
   * Creates a new RegionInfoToken.
   *
   * @param factName     the name of the fact this token will evaluate.
   * @param defaultValue a default value, that will be used if the fact is unknown in the region.
   */
  constructor(private readonly factName: string, private readonly defaultValue?: string) {
    super(undefined, `RegionalInfo<${factName}>`);
  }

  public resolve(ctx: cdk.ResolveContext): any {
    const region = ctx.scope.node.stack.region;
    const fact = RegionInfo.find(region, this.factName);
    if (fact) {
      return fact;
    }
    if (this.defaultValue != null) {
      ctx.scope.node.addWarning(`No regional info found for fact ${this.factName} in ${region}, used default of ${this.defaultValue}`);
      return this.defaultValue;
    }
    throw new Error(`Fact ${this.factName} is unknown for ${region}, and no default value was provided`);
  }
}
