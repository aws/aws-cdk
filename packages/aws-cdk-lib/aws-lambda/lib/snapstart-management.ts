import { CfnFunction } from './lambda.generated';
export class SnapStartConfig {

  public static readonly ON_PUBLISHED_VERSIONS= new SnapStartConfig('PublishedVersions');

  readonly snapConfig: CfnFunction.SnapStartProperty;

  protected constructor(public readonly applyValue: string) {
    this.snapConfig = {
      applyOn: applyValue,
    };
  }
}
