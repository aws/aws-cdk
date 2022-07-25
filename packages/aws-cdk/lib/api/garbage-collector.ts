import * as cxapi from '@aws-cdk/cx-api';
import { SdkProvider } from './aws-auth';
import { Mode } from './aws-auth/credentials';

interface GarbageCollectorProps {
  dryRun: boolean;

  /**
   * The environment to deploy this stack in
   *
   * The environment on the stack artifact may be unresolved, this one
   * must be resolved.
   */
  resolvedEnvironment: cxapi.Environment;

  /**
    * SDK provider (seeded with default credentials)
    *
    * Will exclusively be used to assume publishing credentials (which must
    * start out from current credentials regardless of whether we've assumed an
    * action role to touch the stack or not).
    *
    * Used for the following purposes:
    *
    * - Publish legacy assets.
    * - Upload large CloudFormation templates to the staging bucket.
    */
  sdkProvider: SdkProvider;
}

export class GarbageCollector {
  public constructor(private readonly props: GarbageCollectorProps) {
  }

  public async collect() {
    const sdk = (await this.props.sdkProvider.forEnvironment(this.props.resolvedEnvironment, Mode.ForWriting)).sdk;

    const cfn = sdk.cloudFormation();
    cfn.listStacks(function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    })
  }
}
