/**
 * The type of log to deliver.
 *
 * Valid values depend on the source AWS service. Use the static constants for
 * known V2 Permissions services, or `LogType.of()` for V1 Permissions services
 * (API Gateway, NLB, ElastiCache, etc.) and any types not yet listed here.
 *
 * @see https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/AWS-logs-and-resource-policy.html
 */
export class LogType {
  // ---- Amazon Bedrock ----

  /** Amazon Bedrock Agents / Knowledge Bases application logs. */
  public static readonly BEDROCK_APPLICATION_LOGS = new LogType('APPLICATION_LOGS');

  /** Amazon Bedrock Agents / Knowledge Bases event logs. */
  public static readonly BEDROCK_EVENT_LOGS = new LogType('EVENT_LOGS');

  /** Amazon Bedrock Traces. */
  public static readonly BEDROCK_TRACES = new LogType('TRACES');

  // ---- Amazon EKS ----

  /** EKS Auto Mode block storage logs. */
  public static readonly EKS_AUTO_MODE_BLOCK_STORAGE_LOGS = new LogType('AUTO_MODE_BLOCK_STORAGE_LOGS');

  /** EKS Auto Mode compute logs. */
  public static readonly EKS_AUTO_MODE_COMPUTE_LOGS = new LogType('AUTO_MODE_COMPUTE_LOGS');

  /** EKS Auto Mode IPAM logs. */
  public static readonly EKS_AUTO_MODE_IPAM_LOGS = new LogType('AUTO_MODE_IPAM_LOGS');

  /** EKS Auto Mode load balancing logs. */
  public static readonly EKS_AUTO_MODE_LOAD_BALANCING_LOGS = new LogType('AUTO_MODE_LOAD_BALANCING_LOGS');

  /** EKS capability logs for AWS Controllers for Kubernetes (ACK). */
  public static readonly EKS_CAPABILITY_ACK_LOGS = new LogType('EKS_CAPABILITY_ACK_LOGS');

  /** EKS capability logs for Argo CD application controller. */
  public static readonly EKS_CAPABILITY_ARGOCD_APPLICATION_LOGS = new LogType('EKS_CAPABILITY_ARGOCD_APPLICATION_LOGS');

  /** EKS capability logs for Argo CD ApplicationSet controller. */
  public static readonly EKS_CAPABILITY_ARGOCD_APPLICATIONSET_LOGS = new LogType('EKS_CAPABILITY_ARGOCD_APPLICATIONSET_LOGS');

  /** EKS capability logs for Argo CD commit server. */
  public static readonly EKS_CAPABILITY_ARGOCD_COMMITSERVER_LOGS = new LogType('EKS_CAPABILITY_ARGOCD_COMMITSERVER_LOGS');

  /** EKS capability logs for Argo CD repo server. */
  public static readonly EKS_CAPABILITY_ARGOCD_REPOSERVER_LOGS = new LogType('EKS_CAPABILITY_ARGOCD_REPOSERVER_LOGS');

  /** EKS capability logs for Argo CD server. */
  public static readonly EKS_CAPABILITY_ARGOCD_SERVER_LOGS = new LogType('EKS_CAPABILITY_ARGOCD_SERVER_LOGS');

  /** EKS capability logs for Kro (Kubernetes Resource Orchestrator). */
  public static readonly EKS_CAPABILITY_KRO_LOGS = new LogType('EKS_CAPABILITY_KRO_LOGS');

  // ---- AWS Entity Resolution ----

  /** AWS Entity Resolution workflow logs. */
  public static readonly ENTITY_RESOLUTION_WORKFLOW_LOGS = new LogType('WORKFLOW_LOGS');

  // ---- Amazon EventBridge ----

  /** Amazon EventBridge event bus info logs. */
  public static readonly EVENTBRIDGE_INFO_LOGS = new LogType('INFO_LOGS');

  // ---- IAM Identity Center ----

  /** IAM Identity Center (identity-sync) error logs. */
  public static readonly IAM_IDENTITY_CENTER_ERROR_LOGS = new LogType('ERROR_LOGS');

  // ---- AWS Elemental MediaTailor ----

  /** AWS Elemental MediaTailor ad decision server logs. */
  public static readonly MEDIATAILOR_AD_DECISION_SERVER_LOGS = new LogType('AD_DECISION_SERVER_LOGS');

  /** AWS Elemental MediaTailor manifest service logs. */
  public static readonly MEDIATAILOR_MANIFEST_SERVICE_LOGS = new LogType('MANIFEST_SERVICE_LOGS');

  /** AWS Elemental MediaTailor transcode logs. */
  public static readonly MEDIATAILOR_TRANSCODE_LOGS = new LogType('TRANSCODE_LOGS');

  // ---- AWS Network Firewall ----

  /** AWS Network Firewall proxy alert logs. */
  public static readonly NETWORK_FIREWALL_ALERT_LOGS = new LogType('ALERT_LOGS');

  /** AWS Network Firewall proxy allow logs. */
  public static readonly NETWORK_FIREWALL_ALLOW_LOGS = new LogType('ALLOW_LOGS');

  /** AWS Network Firewall proxy deny logs. */
  public static readonly NETWORK_FIREWALL_DENY_LOGS = new LogType('DENY_LOGS');

  // ---- AWS PCS (Parallel Computing Service) ----

  /** AWS PCS job completion logs. */
  public static readonly PCS_JOBCOMP_LOGS = new LogType('PCS_JOBCOMP_LOGS');

  /** AWS PCS scheduler audit logs. */
  public static readonly PCS_SCHEDULER_AUDIT_LOGS = new LogType('PCS_SCHEDULER_AUDIT_LOGS');

  /** AWS PCS scheduler logs. */
  public static readonly PCS_SCHEDULER_LOGS = new LogType('PCS_SCHEDULER_LOGS');

  // ---- Amazon QuickSight ----

  /** Amazon QuickSight agent hours logs. */
  public static readonly QUICKSIGHT_AGENT_HOURS_LOGS = new LogType('AGENT_HOURS_LOGS');

  /** Amazon QuickSight Q / Quick Chat logs. */
  public static readonly QUICKSIGHT_CHAT_LOGS = new LogType('CHAT_LOGS');

  /** Amazon QuickSight feedback logs. */
  public static readonly QUICKSIGHT_FEEDBACK_LOGS = new LogType('FEEDBACK_LOGS');

  /** Amazon QuickSight index usage logs. */
  public static readonly QUICKSIGHT_INDEX_USAGE_LOGS = new LogType('INDEX_USAGE_LOGS');

  /** Amazon QuickSight knowledge base file sync logs. */
  public static readonly QUICKSIGHT_KB_FILE_SYNC_LOGS = new LogType('KB_FILE_SYNC_LOGS');

  // ---- AWS Security Hub ----

  /** AWS Security Hub security finding logs. */
  public static readonly SECURITY_HUB_SECURITY_FINDING_LOGS = new LogType('SECURITY_FINDING_LOGS');

  // ---- Amazon Q in Connect (formerly Wisdom) ----

  /** Amazon Q in Connect event logs. */
  public static readonly WISDOM_EVENT_LOGS = new LogType('EVENT_LOGS');

  /**
   * Create a `LogType` from an arbitrary string value.
   * Use this for V1 Permissions services (API Gateway, NLB, ElastiCache, etc.)
   * and any log types not yet represented as static members.
   */
  public static of(value: string): LogType {
    return new LogType(value);
  }

  /**
   * The raw string value sent to CloudFormation.
   */
  public readonly value: string;

  constructor(value: string) {
    this.value = value;
  }

  public toString(): string {
    return this.value;
  }
}
