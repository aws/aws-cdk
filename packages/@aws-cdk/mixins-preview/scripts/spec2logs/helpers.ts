import { Type, ExternalModule, $T } from '@cdklabs/typewriter';

class MixinsLogsDelivery extends ExternalModule {
  public readonly S3LogsDelivery = Type.fromName(this, 'S3LogsDelivery');
  public readonly LogGroupLogsDelivery = Type.fromName(this, 'LogGroupLogsDelivery');
  public readonly FirehoseLogsDelivery = Type.fromName(this, 'FirehoseLogsDelivery');
  public readonly XRayLogsDelivery = Type.fromName(this, 'XRayLogsDelivery');
  public readonly DestLogsDelivery = Type.fromName(this, 'DestinationLogsDelivery');
  public readonly ILogsDelivery = Type.fromName(this, 'ILogsDelivery');
  public readonly S3LogsDeliveryPermissionsVersion = $T(Type.fromName(this, 'S3LogsDeliveryPermissionsVersion'));
}

export const MIXINS_LOGS_DELIVERY = new MixinsLogsDelivery('@aws-cdk/mixins-preview/services/aws-logs');
