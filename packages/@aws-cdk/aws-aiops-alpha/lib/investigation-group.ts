import { CfnInvestigationGroup } from 'aws-cdk-lib/aws-aiops';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { RemovalPolicy, Resource, Arn, Duration, IResource } from 'aws-cdk-lib/core';
import { Construct } from 'constructs';

/**
 * Represents an Investigation Group, either created with CDK or imported.
 */
export interface IInvestigationGroup extends IResource {
  /**
   * The ARN of the investigation group.
   * @attribute
   */
  readonly investigationGroupArn: string;

  /**
   * The name of the investigation group.
   * @attribute
   */
  readonly investigationGroupName: string;

  /**
   * The IAM role used by the investigation group.
   */
  readonly role: iam.IRole;

  /**
   * The KMS key used to encrypt investigation group data.
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * Grant permissions to create investigations in this group.
   */
  grantCreate(grantee: iam.IGrantable): iam.Grant;

  /**
   * Add a statement to the investigation group's resource policy.
   */
  addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult;

  /**
   * Add a cross-account configuration to the investigation group.
   */
  addCrossAccountConfiguration(sourceAccountRole: Arn): void;

  /**
   * Add a chatbot notification channel.
   */
  addChatbotNotification(snsTopic: Arn): void;
}

/**
 * Attributes for importing an existing InvestigationGroup
 */
export interface InvestigationGroupAttributes {
  /**
   * The ARN of the investigation group.
   */
  readonly investigationGroupArn: string;

  /**
   * The name of the investigation group.
   */
  readonly name: string;

  /**
   * The IAM role used by the investigation group.
   *
   * @default - Role will be looked up from the investigation group ARN
   */
  readonly role?: iam.IRole;

  /**
   * The KMS key used to encrypt investigation group data.
   *
   * @default - No encryption key specified
   */
  readonly encryptionKey?: kms.IKey;
}

/**
 * Properties for defining an InvestigationGroup
 */
export interface InvestigationGroupProps {
  /**
   * The name of the investigation group.
   *
   */
  readonly investigationGroupName: string;

  /**
   * The IAM role that AIOps will assume to access resources.
   *
   * @default - A role is automatically created with necessary permissions
   */
  readonly role?: iam.IRole;

  /**
   * The KMS key used to encrypt investigation group data.
   *
   * @default - AWS managed key is used
   */
  readonly encryptionKey?: kms.IKey;

  /**
   * List of chatbot notification channels for alerts.
   *
   * @default - No chatbot notifications
   */
  readonly chatbotNotificationChannels?: Arn[];

  /**
   * Cross-account configurations for multi-account investigations.
   * Maximum of 25 configurations allowed.
   *
   * @default - No cross-account configurations
   */
  readonly crossAccountConfigurations?: Arn[];

  /**
   * Whether to enable CloudTrail event history for investigations.
   *
   * @default false
   */
  readonly isCloudTrailEventHistoryEnabled?: boolean;

  /**
   * The retention period for investigation data in days.
   * Must be between 7 and 90 days.
   *
   * @default 90
   */
  readonly retention?: Duration;

  /**
   * The removal policy for the investigation group.
   *
   * @default RemovalPolicy.DESTROY
   */
  readonly removalPolicy?: RemovalPolicy;

  /**
   * Tag key boundaries for resource tagging.
   *
   * @default - No tag key boundaries
   */
  readonly tagKeyBoundaries?: string[];
}

/**
 * An AWS AIOps Investigation Group
 *
 * Investigation Groups provide a way to organize and manage AI-powered operational investigations
 * across AWS resources and accounts.
 */
export class InvestigationGroup extends Resource implements IInvestigationGroup {
  /**
   * Import an existing Investigation Group from its attributes.
   *
   * @param scope The parent construct
   * @param id The construct ID
   * @param attrs The attributes of the Investigation Group to import
   * @returns An Investigation Group construct representing the imported resource
   */
  public static fromInvestigationGroupAttributes(scope: Construct, id: string, attrs: InvestigationGroupAttributes): IInvestigationGroup {
    class Import extends InvestigationGroup {
      public readonly investigationGroupArn = attrs.investigationGroupArn;
      public readonly name = attrs.name;
      public readonly encryptionKey = attrs.encryptionKey;

      constructor() {
        super(scope, id, {
          investigationGroupName: attrs.name,
          encryptionKey: attrs.encryptionKey,
        });
      }
    }

    return new Import();
  }

  /**
   * The name of the investigation group
   */
  public readonly investigationGroupName: string;

  /**
   * The ARN of the investigation group
   * @attribute
   */
  public readonly investigationGroupArn: string;

  /**
   * The IAM role used by the investigation group
   */
  public readonly role: iam.IRole;

  /**
   * Resouce policy document for this investigation group resource.
   *
   * Use addToResourcePolicy method to update this policy.
   */
  protected policy?: iam.PolicyDocument;

  /**
   * The KMS key used to encrypt investigation group data.
   *
   * When specified, this customer-managed KMS key will be used to encrypt
   * all investigation data at rest. If not provided, AWS managed encryption
   * will be used instead.
   *
   * @default - AWS managed key is used for encryption
   */
  public readonly encryptionKey?: kms.IKey | undefined;

  /**
   * Cross-account configurations for multi-account investigations.
   *
   * These configurations allow the investigation group to access resources
   * and perform investigations across multiple AWS accounts. Each configuration
   * specifies a source account role ARN that the investigation group can assume.
   * Maximum of 25 configurations allowed.
   *
   * @default - No cross-account configurations
   */
  public readonly crossAccountConfigurations: Arn[] = [];

  /**
   * Chatbot notification channels for investigation alerts.
   *
   * These SNS topic ARNs define where investigation alerts and notifications
   * will be sent. The topics can be integrated with AWS Chatbot to deliver
   * notifications to Slack, Microsoft Teams, or other chat platforms.
   *
   * @default - No chatbot notification channels
   */
  public readonly chatbotNotificationChannels: Arn[] = [];

  constructor(scope: Construct, id: string, props: InvestigationGroupProps) {
    super(scope, id);

    // Validate retention period
    if (props.retention !== undefined && (props.retention.toDays() < 7 || props.retention.toDays() > 90)) {
      throw new RangeError('retentionInDays must be between 7 and 90 days');
    }

    // Validate cross-account configurations limit
    if (props.crossAccountConfigurations && props.crossAccountConfigurations.length > 25) {
      throw new RangeError('Maximum of 25 cross-account configurations allowed');
    }

    // Validate cross-account configuration ARNs
    if (props.crossAccountConfigurations) {
      for (const xcRoleArn of props.crossAccountConfigurations) {
        this.validateRoleArn(xcRoleArn.toString());
      }
    }

    if (props.chatbotNotificationChannels) {
      for (const channelArn of props.chatbotNotificationChannels) {
        if (!this.isValidSNSTopicArn(channelArn.toString())) {
          throw new TypeError('Invalid SNS topic ARN format');
        }
      }
    }

    // Create or use provided role
    this.role = props.role ?? this.createDefaultRole(props.encryptionKey);
    this.investigationGroupName = props.investigationGroupName;
    if (props.encryptionKey) {
      this.encryptionKey = props.encryptionKey;
    }

    // Initialize collections
    if (props.crossAccountConfigurations) {
      this.crossAccountConfigurations = props.crossAccountConfigurations.map(xcRoleArn => ({
        sourceRoleArn: xcRoleArn,
      } as CfnInvestigationGroup.CrossAccountConfigurationProperty));
    }
    if (props.chatbotNotificationChannels) {
      this.chatbotNotificationChannels = props.chatbotNotificationChannels.map(channelArn => ({
        snsTopicArn: channelArn,
      } as CfnInvestigationGroup.ChatbotNotificationChannelProperty));
    }

    // Create the CloudFormation resource
    const resource = new CfnInvestigationGroup(this, 'Resource', {
      name: props.investigationGroupName,
      roleArn: this.role.roleArn,
      encryptionConfig: props.encryptionKey ? {
        encryptionConfigurationType: 'CUSTOMER_MANAGED_KEY',
        kmsKeyId: props.encryptionKey.keyArn,
      } : undefined,
      chatbotNotificationChannels: this.chatbotNotificationChannels,
      crossAccountConfigurations: this.crossAccountConfigurations,
      isCloudTrailEventHistoryEnabled: props.isCloudTrailEventHistoryEnabled ?? true,
      retentionInDays: props.retention?.toDays() ?? 90,
      tagKeyBoundaries: props.tagKeyBoundaries,
    });

    // Set removal policy
    resource.applyRemovalPolicy(props.removalPolicy ?? RemovalPolicy.RETAIN);

    // Set outputs
    this.investigationGroupArn = resource.attrArn;
  }

  /**
   * Add a cross-account configuration to the investigation group
   */
  public addCrossAccountConfiguration(sourceAccountRole: Arn): void {
    if (this.crossAccountConfigurations.length >= 25) {
      throw new RangeError('Maximum of 25 cross-account configurations allowed');
    }

    this.validateRoleArn(sourceAccountRole.toString());

    this.crossAccountConfigurations.push({
      sourceRoleArn: sourceAccountRole,
    });
  }

  /**
   * Add a chatbot notification channel
   */
  public addChatbotNotification(snsTopic: Arn): void {
    if (snsTopic && !this.isValidSNSTopicArn(snsTopic.toString())) {
      throw new TypeError('Invalid SNS topic ARN format');
    }

    this.chatbotNotificationChannels.push({
      snsTopicArn: snsTopic,
    });
  }

  /**
   * Add a statement to the investigation group's resource policy
   */
  public addToResourcePolicy(statement: iam.PolicyStatement): iam.AddToResourcePolicyResult {
    if (!this.policy) {
      this.policy = new iam.PolicyDocument();
    }
    this.policy.addStatements(statement);
    return { statementAdded: true, policyDependable: this.policy };
  }

  /**
   * Grant permissions to create investigations in this group
   */
  public grantCreate(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: [
        'aiops:CreateInvestigation',
        'aiops:CreateInvestigationEvent',
      ],
      resourceArns: [this.investigationGroupArn],
    });
  }

  private createDefaultRole(encryptionKey?: kms.IKey): iam.Role {
    const role = new iam.Role(this, 'InvestigationGroupRole', {
      roleName: 'AIOpsRole-DefaultInvestigationGroup',
      assumedBy: new iam.ServicePrincipal('aiops.amazonaws.com'),
      description: 'Role for AIOps Investigation Group',
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AIOpsAssistantPolicy'),
      ],
    });

    // Add KMS permissions if encryption key is provided
    if (encryptionKey) {
      encryptionKey.grantDecrypt(role);
    }

    return role;
  }

  private validateRoleArn(roleArn: string): void {
    const arnPattern = /^arn:aws:iam::\d{12}:role\/[\w+=,.@-]+$/;
    if (!arnPattern.test(roleArn)) {
      throw new TypeError(`Invalid IAM role ARN format: ${roleArn}`);
    }
  }

  private isValidSNSTopicArn(arn: string): boolean {
    const arnPattern = /^arn:aws:[\w-]+:[\w-]*:\d{12}:sns\/[\w\-\/]+$/;
    return arnPattern.test(arn);
  }
}
