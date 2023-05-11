import { DefaultStagingStack, DefaultStagingStackOptions, IStagingResourcesFactory } from '../lib';

interface PermanentAssetsStagingStackOptions extends DefaultStagingStackOptions {}

class PermanentAssetsStagingStack extends DefaultStagingStack {
  public static factory(options: PermanentAssetsStagingStackOptions): IStagingResourcesFactory {
    const factory = DefaultStagingStack.factory(options);
    return {
      obtainStagingResources(stack, context) {
        
      },
    }
  }
}