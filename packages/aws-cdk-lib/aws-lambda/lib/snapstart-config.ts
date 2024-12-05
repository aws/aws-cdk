import { CfnFunction } from './lambda.generated';

export abstract class SnapStartConf {
  // Enable SnapStart on published lambda versions, this is the only available option available
  // see https://docs.aws.amazon.com/lambda/latest/dg/API_SnapStart.html
  public static readonly ON_PUBLISHED_VERSIONS = SnapStartConf.applyOn('PublishedVersions');

  private static applyOn(applyValue: string): SnapStartConf {
    return new class extends SnapStartConf {
      public _render() {
        return {
          applyOn: applyValue,
        } satisfies CfnFunction.SnapStartProperty;
      }
    };
  }

  /**
  * @internal
  */
  public abstract _render(): any;
}
