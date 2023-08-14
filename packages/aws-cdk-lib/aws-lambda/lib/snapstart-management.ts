import { CfnFunction } from './lambda.generated';
export class SnapStartConfig {
  // Enable SnapStart on published lambda versions, this is the only available option available
  // see https://docs.aws.amazon.com/lambda/latest/dg/API_SnapStart.html
  public static readonly ON_PUBLISHED_VERSIONS= new SnapStartConfig('PublishedVersions');

  readonly snapStartConfig: CfnFunction.SnapStartProperty;

  protected constructor(public readonly applyValue: string) {
    this.snapStartConfig = {
      applyOn: applyValue,
    };
  }
}
