
import { SdkProvider } from '../../api/aws-cdk';
import { ActionAwareIoHost } from '../../api/io/private';

/**
 * Helper struct to pass internal services around.
 */
export interface ToolkitServices {
  sdkProvider: SdkProvider;
  ioHost: ActionAwareIoHost;
}
