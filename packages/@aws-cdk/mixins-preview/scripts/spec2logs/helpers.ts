import { Type, ExternalModule, $T } from '@cdklabs/typewriter';

class MixinsLogsDelivery extends ExternalModule {
  public readonly S3LogsDelivery = Type.fromName(this, 'S3LogsDelivery');
  public readonly LogGroupLogsDelivery = Type.fromName(this, 'LogGroupLogsDelivery');
  public readonly FirehoseLogsDelivery = Type.fromName(this, 'FirehoseLogsDelivery');
  public readonly XRayLogsDelivery = Type.fromName(this, 'XRayLogsDelivery');
  public readonly ILogsDelivery = Type.fromName(this, 'ILogsDelivery');
  public readonly S3LogsDeliveryPermissionsVersion = $T(Type.fromName(this, 'S3LogsDeliveryPermissionsVersion'));
}

class CdkRefInterfaces extends ExternalModule {
  public readonly IBucketRef = Type.fromName(this, 'aws_s3.IBucketRef');
  public readonly ILogGroupRef = Type.fromName(this, 'aws_logs.ILogGroupRef');
  public readonly IDeliveryStreamRef = Type.fromName(this, 'aws_kinesisfirehose.IDeliveryStreamRef');
}

class CdkAwsLogs extends ExternalModule {
  public readonly CfnDeliverySource = Type.fromName(this, 'CfnDeliverySource');
}

export const MIXINS_LOGS_DELIVERY = new MixinsLogsDelivery('@aws-cdk/mixins-preview/services/aws-logs');
export const REF_INTERFACES = new CdkRefInterfaces('aws-cdk-lib/interfaces');
export const CDK_AWS_LOGS = new CdkAwsLogs('aws-cdk-lib/aws-logs');
