
import { SdkProvider } from '../../aws-cdk';
import { ActionAwareIoHost } from '../../io/private';

/**
 * Helper struct to pass internal services around.
 */
export interface ToolkitServices {
  sdkProvider: SdkProvider;
  ioHost: ActionAwareIoHost;
}
