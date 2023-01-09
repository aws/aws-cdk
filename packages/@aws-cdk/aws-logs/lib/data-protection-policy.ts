/**
 * Represents a data protection policy in a log group.
 */
export class DataProtectionPolicy {

  /**
   * Name of the data protection policy
   *
   * @default - 'data-protection-policy-cdk'
   */
  public readonly name: string;

  /**
   * Description of the data protection policy
   *
   * @default - 'cdk generated data protection policy'
   */
  public readonly description: string;

  /**
   * Version of the data protection policy
   *
   * @default - '2021-06-01'
   */
  public readonly version: string;

  /**
   * Statements within the data protection policy. Must contain one Audit and one Redact statement
   *
   * @default - one AuditStatement and one RedactStatement
   */
  public readonly statement: any[];

  constructor(props: DataProtectionPolicyProps) {
    this.name = props.name || 'data-protection-policy-cdk';
    this.description = props.description || 'cdk generated data protection policy';
    this.version = '2021-06-01';

    var findingsDestination: FindingsDestination = {};

    if (props.cloudWatchLogsAuditDestination) {
      findingsDestination.cloudWatchLogs = {
        logGroup: props.cloudWatchLogsAuditDestination,
      };
    }

    if (props.s3AuditDestination) {
      findingsDestination.s3 = {
        bucket: props.s3AuditDestination,
      };
    }

    if (props.firehoseAuditDestination) {
      findingsDestination.firehose = {
        deliveryStream: props.firehoseAuditDestination,
      };
    }

    var identifierArns: string[] = [];
    for (let identifier of props.identifiers) {
      identifierArns.push('arn:aws:dataprotection::aws:data-identifier/' + identifier);
    };

    var auditStatement: AuditStatement = {
      sid: 'audit-statement-cdk',
      dataIdentifier: identifierArns,
      operation: {
        audit: {
          findingsDestination: findingsDestination,
        },
      },
    };

    var redactStatement: RedactStatement = {
      sid: 'redact-statement-cdk',
      dataIdentifier: identifierArns,
      operation: {
        deidentify: {
          maskConfig: {},
        },
      },
    };

    this.statement = [auditStatement, redactStatement];
  }

}

type AuditStatement = {
  sid: string;
  dataIdentifier: string[];
  operation: AuditOperation;
}

type AuditOperation = {
  audit: FindingsDestinations;
}

type FindingsDestinations = {
  findingsDestination: FindingsDestination;
}

type FindingsDestination = {
  cloudWatchLogs?: CloudWatchLogsDestination;
  firehose?: FirehoseDestination;
  s3?: S3Destination;
}

type CloudWatchLogsDestination = {
  logGroup: string;
}

type FirehoseDestination = {
  deliveryStream: string;
}

type S3Destination = {
  bucket: string;
}

type RedactStatement = {
  sid: string;
  dataIdentifier: string[];
  operation: DeidentifyOperation;
}

type DeidentifyOperation = {
  deidentify: MaskConfig;
}

type MaskConfig = {
  maskConfig: {}
}


/**
 * Interface for creating a data protection policy
 */
export interface DataProtectionPolicyProps {
  /**
   * Name of the data protection policy
   *
   * @default - 'data-protection-policy-cdk'
   */
  readonly name?: string;

  /**
   * Description of the data protection policy
   *
   * @default - 'cdk generated data protection policy'
   */
  readonly description?: string;

  /**
   * List of data protection identifiers. Must be in the following list: https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/protect-sensitive-log-data-types.html
   */
  readonly identifiers: string[];

  /**
   * CloudWatch Logs log group to send audit findings to. The log group must already exist.
   *
   * @default - no CloudWatch Logs audit destination
   */
  readonly cloudWatchLogsAuditDestination?: string;

  /**
   * S3 bucket to send audit findings to. The bucket must already exist.
   *
   * @default - no S3 bucket audit destination
   */
  readonly s3AuditDestination?: string;

  /**
   * Amazon Kinesis Data Firehose stream to send audit findings to. The delivery stream must already exist.
   *
   * @default - no firehose delivery stream audit destination
   */
  readonly firehoseAuditDestination?: string;
}

