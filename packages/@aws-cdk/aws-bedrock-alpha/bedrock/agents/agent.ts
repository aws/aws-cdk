import * as crypto from 'crypto';
import { Arn, ArnFormat, Duration, IResource, Lazy, Names, Resource, Stack, Token, ValidationError } from 'aws-cdk-lib/core';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { addConstructMetadata, MethodMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct, IConstruct } from 'constructs';
// Internal Libs
import { AgentActionGroup } from './action-group';
import { AgentAlias, IAgentAlias } from './agent-alias';
import { AgentCollaborator } from './agent-collaborator';
import { AgentCollaboration } from './agent-collaboration';
import { PromptOverrideConfiguration } from './prompt-override';
import { AssetApiSchema, S3ApiSchema } from './api-schema';
import { IGuardrail } from '../guardrails/guardrails';
import * as validation from './validation-helpers';
import { IBedrockInvokable } from '.././models';
import { Memory } from './memory';
import { CustomOrchestrationExecutor, OrchestrationType } from './orchestration-executor';

/******************************************************************************
 *                              CONSTANTS
 *****************************************************************************/
/**
 * The minimum number of characters required for an agent instruction.
 * @internal
 */
const MIN_INSTRUCTION_LENGTH = 40;

/**
 * The maximum length for the node address in permission policy names.
 * @internal
 */
const MAX_POLICY_NAME_NODE_LENGTH = 16;

/******************************************************************************
 *                              COMMON
 *****************************************************************************/
/**
 * Represents an Agent, either created with CDK or imported.
 */
export interface IAgent extends IResource, iam.IGrantable {
  /**
   * The ARN of the agent.
   * @attribute
   */
  readonly agentArn: string;
  /**
   * The ID of the Agent.
   * @attribute
   */
  readonly agentId: string;
  /**
   * The IAM role associated to the agent.
   */
  readonly role: iam.IRole;
  /**
   * Optional KMS encryption key associated with this agent
   */
  readonly kmsKey?: kms.IKey;
  /**
   * When this agent was last updated.
   * @attribute
   */
  readonly lastUpdated?: string;

  /**
   * Grant invoke permissions on this agent to an IAM principal.
   * Note: This grant will only work when the grantee is in the same AWS account
   * where the agent is defined. Cross-account invocation is not supported.
   */
  grantInvoke(grantee: iam.IGrantable): iam.Grant;

  /**
   * Defines a CloudWatch event rule triggered by agent events.
   */
  onEvent(id: string, options?: events.OnEventOptions): events.Rule;

  /**
   * Return the CloudWatch metric for agent count.
   */
  metricCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric;
}
/******************************************************************************
 *                        ABSTRACT BASE CLASS
 *****************************************************************************/
/**
 * Abstract base class for an Agent.
 * Contains methods and attributes valid for Agents either created with CDK or imported.
 */
export abstract class AgentBase extends Resource implements IAgent {
  public abstract readonly agentArn: string;
  public abstract readonly agentId: string;
  public abstract readonly role: iam.IRole;
  public abstract readonly kmsKey?: kms.IKey;
  public abstract readonly lastUpdated?: string;
  /**
   * The version of the agent.
   * @attribute
   */
  public abstract readonly agentVersion: string;
  public abstract readonly grantPrincipal: iam.IPrincipal;

  /**
   * Grant invoke permissions on this agent to an IAM principal.
   *
   * @param grantee - The IAM principal to grant invoke permissions to
   * @default - Default grant configuration:
   * - actions: ['bedrock:InvokeAgent']
   * - resourceArns: [this.agentArn]
   * @returns An IAM Grant object representing the granted permissions
   */
  public grantInvoke(grantee: iam.IGrantable): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions: ['bedrock:InvokeAgent'],
      resourceArns: [this.agentArn],
    });
  }

  /**
   * Creates an EventBridge rule for agent events.
   *
   * @param id - Unique identifier for the rule
   * @param options - Configuration options for the event rule
   * @default - Default event pattern:
   * - source: ['aws.bedrock']
   * - detail: { 'agent-id': [this.agentId] }
   * @returns An EventBridge Rule configured for agent events
   */
  public onEvent(id: string, options: events.OnEventOptions = {}): events.Rule {
    // Create rule with minimal props and event pattern
    const rule = new events.Rule(this, id, {
      description: options.description,
      eventPattern: {
        source: ['aws.bedrock'],
        detail: {
          'agent-id': [this.agentId],
        },
      },
    });

    // Add target if provided
    if (options.target) {
      rule.addTarget(options.target);
    }
    return rule;
  }

  /**
   * Creates a CloudWatch metric for tracking agent invocations.
   *
   * @param props - Configuration options for the metric
   * @default - Default metric configuration:
   * - namespace: 'AWS/Bedrock'
   * - metricName: 'Invocations'
   * - dimensionsMap: { AgentId: this.agentId }
   * @returns A CloudWatch Metric configured for agent invocation counts
   */
  public metricCount(props?: cloudwatch.MetricOptions): cloudwatch.Metric {
    return new cloudwatch.Metric({
      namespace: 'AWS/Bedrock',
      metricName: 'Invocations',
      dimensionsMap: {
        AgentId: this.agentId,
      },
      ...props,
    }).attachTo(this);
  }
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a CDK managed Bedrock Agent.
 * TODO: Knowledge bases configuration will be added in a future update
 * TODO: Inference profile configuration will be added in a future update
 *
 */
export interface AgentProps {

  /**
   * The name of the agent.
   * This will be used as the physical name of the agent.
   *
   * @default - A name is generated by CDK.
   * Supported pattern : ^([0-9a-zA-Z][_-]?){1,100}$
   */
  readonly agentName?: string;
  /**
   * The instruction used by the agent. This determines how the agent will perform his task.
   * This instruction must have a minimum of 40 characters.
   */
  readonly instruction: string;
  /**
   * The foundation model used for orchestration by the agent.
   */
  readonly foundationModel: IBedrockInvokable;
  /**
   * An existing IAM Role to associate with this agent.
   * Use this property when you want to reuse an existing IAM role rather than create a new one.
   * The role must have a trust policy that allows the Bedrock service to assume it.
   * @default - A new role is created for you.
   */
  readonly existingRole?: iam.IRole;
  /**
   * Specifies whether to automatically update the `DRAFT` version of the agent after
   * making changes to the agent. The `DRAFT` version can be continually iterated
   * upon during internal development.
   *
   * @default - false
   */
  readonly shouldPrepareAgent?: boolean;
  /**
   * How long sessions should be kept open for the agent. If no conversation occurs
   * during this time, the session expires and Amazon Bedrock deletes any data
   * provided before the timeout.
   *
   * @default - 10 minutes
   */
  readonly idleSessionTTL?: Duration;
  /**
   * The KMS key of the agent if custom encryption is configured.
   *
   * @default - An AWS managed key is used.
   */
  readonly kmsKey?: kms.IKey;
  /**
   * A description of the agent.
   *
   * @default - No description is provided.
   */
  readonly description?: string;
  /**
   * The Action Groups associated with the agent.
   * @default - Only default action groups (UserInput and CodeInterpreter) are added
   */
  readonly actionGroups?: AgentActionGroup[];
  /**
   * The guardrail that will be associated with the agent.
   * @default - No guardrail is provided.
   */
  readonly guardrail?: IGuardrail;
  /**
   * Overrides some prompt templates in different parts of an agent sequence configuration.
   *
   * @default - No overrides are provided.
   */
  readonly promptOverrideConfiguration?: PromptOverrideConfiguration;
  /**
   * Select whether the agent can prompt additional information from the user when it does not have
   * enough information to respond to an utterance
   *
   * @default - false
   */
  readonly userInputEnabled?: boolean;
  /**
   * Select whether the agent can generate, run, and troubleshoot code when trying to complete a task
   *
   * @default - false
   */
  readonly codeInterpreterEnabled?: boolean;
  /**
   * Whether to delete the resource even if it's in use.
   *
   * @default - false
   */
  readonly forceDelete?: boolean;
  /**
   * The type and configuration of the memory to maintain context across multiple sessions and recall past interactions.
   * This can be useful for maintaining continuity in multi-turn conversations and recalling user preferences
   * or past interactions.
   *
   * @see https://docs.aws.amazon.com/bedrock/latest/userguide/agents-memory.html
   * @default - No memory will be used. Agents will retain context from the current session only.
   */
  readonly memory?: Memory;
  /**
   * Configuration for agent collaboration settings, including AgentCollaboratorType and AgentCollaborators.
   * This property allows you to define how the agent collaborates with other agents
   * and what collaborators it can work with.
   *
   * @default - No agent collaboration configuration.
   */
  readonly agentCollaboration?: AgentCollaboration;
  /**
   * The Lambda function to use for custom orchestration.
   * If provided, custom orchestration will be used.
   * If not provided, default orchestration will be used.
   *
   * @default - Default orchestration
   */
  readonly customOrchestrationExecutor?: CustomOrchestrationExecutor;
}
/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Attributes for specifying an imported Bedrock Agent.
 */
export interface AgentAttributes {
  /**
   * The ARN of the agent.
   * @attribute
   */
  readonly agentArn: string;
  /**
   * The ARN of the IAM role associated to the agent.
   * @attribute
   */
  readonly roleArn: string;
  /**
   * Optional KMS encryption key associated with this agent
   * @default undefined - An AWS managed key is used
   */
  readonly kmsKeyArn?: string;
  /**
   * When this agent was last updated.
   * @default undefined - No last updated timestamp is provided
   */
  readonly lastUpdated?: string;
  /**
   * The agent version. If no explicit versions have been created,
   * leave this empty to use the DRAFT version. Otherwise, use the
   * version number (e.g. 1).
   * @default 'DRAFT'
   */
  readonly agentVersion?: string;
}
/******************************************************************************
 *                        NEW CONSTRUCT DEFINITION
 *****************************************************************************/
/**
 * Class to create (or import) an Agent with CDK.
 * @cloudformationResource AWS::Bedrock::Agent
 */
@propertyInjectable
export class Agent extends AgentBase implements IAgent {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-alpha.Agent';

  /**
   * Static Method for importing an existing Bedrock Agent.
   */
  /**
   * Creates an Agent reference from an existing agent's attributes.
   *
   * @param scope - The construct scope
   * @param id - Identifier of the construct
   * @param attrs - Attributes of the existing agent
   * @default - For attrs.agentVersion: 'DRAFT' if no explicit version is provided
   * @returns An IAgent reference to the existing agent
   */
  public static fromAgentAttributes(scope: Construct, id: string, attrs: AgentAttributes): IAgent {
    class Import extends AgentBase {
      public readonly agentArn = attrs.agentArn;
      public readonly agentId = Arn.split(attrs.agentArn, ArnFormat.SLASH_RESOURCE_NAME).resourceName!;
      public readonly role = iam.Role.fromRoleArn(scope, `${id}Role`, attrs.roleArn);
      public readonly kmsKey = attrs.kmsKeyArn ? kms.Key.fromKeyArn(scope, `${id}Key`, attrs.kmsKeyArn) : undefined;
      public readonly lastUpdated = attrs.lastUpdated;
      public readonly agentVersion = attrs.agentVersion ?? 'DRAFT';
      public readonly grantPrincipal = this.role;
    }

    // Return new Agent
    return new Import(scope, id);
  }
  // ------------------------------------------------------
  // Base attributes
  // ------------------------------------------------------
  /**
   * The unique identifier for the agent
   * @attribute
   */
  public readonly agentId: string;
  /**
   * The ARN of the agent.
   * @attribute
   */
  public readonly agentArn: string;
  /**
   * The version of the agent.
   * @attribute
   */
  public readonly agentVersion: string;
  /**
   * The IAM role associated to the agent.
   */
  public readonly role: iam.IRole;
  /**
   * Optional KMS encryption key associated with this agent
   */
  public readonly kmsKey?: kms.IKey;
  /**
   * When this agent was last updated.
   */
  public readonly lastUpdated?: string;
  /**
   * The principal to grant permissions to
   */
  public readonly grantPrincipal: iam.IPrincipal;
  /**
   * Default alias of the agent
   */
  public readonly testAlias: IAgentAlias;
  /**
   * action groups associated with the ageny
   */
  public readonly actionGroups: AgentActionGroup[] = [];
  /**
   * The guardrail that will be associated with the agent.
   */
  public guardrail?: IGuardrail;
  // ------------------------------------------------------
  // CDK-only attributes
  // ------------------------------------------------------
  /**
   * The name of the agent.
   */
  public readonly name: string;

  // ------------------------------------------------------
  // Internal Only
  // ------------------------------------------------------
  private readonly ROLE_NAME_SUFFIX = '-bedrockagent';
  private readonly MAXLENGTH_FOR_ROLE_NAME = 64;
  private readonly idleSessionTTL: Duration;
  private readonly foundationModel: IBedrockInvokable;
  private readonly userInputEnabled: boolean;
  private readonly codeInterpreterEnabled: boolean;
  private readonly agentCollaboration?: AgentCollaboration;
  private readonly customOrchestrationExecutor?: CustomOrchestrationExecutor;
  private readonly promptOverrideConfiguration?: PromptOverrideConfiguration;
  private readonly __resource: bedrock.CfnAgent;

  // ------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------
  constructor(scope: Construct, id: string, props: AgentProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Validate props
    // ------------------------------------------------------
    if (props.instruction !== undefined &&
        !Token.isUnresolved(props.instruction) &&
        props.instruction.length < MIN_INSTRUCTION_LENGTH) {
      throw new ValidationError(`instruction must be at least ${MIN_INSTRUCTION_LENGTH} characters`, this);
    }

    // Validate idleSessionTTL
    if (props.idleSessionTTL !== undefined &&
        !Token.isUnresolved(props.idleSessionTTL) &&
        (props.idleSessionTTL.toMinutes() < 1 || props.idleSessionTTL.toMinutes() > 60)) {
      throw new ValidationError('idleSessionTTL must be between 1 and 60 minutes', this);
    }

    // ------------------------------------------------------
    // Set properties and defaults
    // ------------------------------------------------------
    this.name =
      props.agentName ?? this.generatePhysicalName() + this.ROLE_NAME_SUFFIX;
    this.idleSessionTTL = props.idleSessionTTL ?? Duration.minutes(10);
    this.userInputEnabled = props.userInputEnabled ?? false;
    this.codeInterpreterEnabled = props.codeInterpreterEnabled ?? false;
    this.foundationModel = props.foundationModel;
    // Optional
    this.promptOverrideConfiguration = props.promptOverrideConfiguration;
    this.kmsKey = props.kmsKey;
    this.customOrchestrationExecutor = props.customOrchestrationExecutor;

    // ------------------------------------------------------
    // Role
    // ------------------------------------------------------
    // If existing role is provided, use it.
    if (props.existingRole) {
      this.role = props.existingRole;
      this.grantPrincipal = this.role;
      // Otherwise, create a new one
    } else {
      this.role = new iam.Role(this, 'Role', {
        // generate a role name
        roleName: this.generatePhysicalName() + this.ROLE_NAME_SUFFIX,
        // ensure the role has a trust policy that allows the Bedrock service to assume the role
        assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com').withConditions({
          StringEquals: {
            'aws:SourceAccount': { Ref: 'AWS::AccountId' },
          },
          ArnLike: {
            'aws:SourceArn': Stack.of(this).formatArn({
              service: 'bedrock',
              resource: 'agent',
              resourceName: '*',
              arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
            }),
          },
        }),
      });
      this.grantPrincipal = this.role;
    }
    // ------------------------------------------------------
    // Set Lazy Props initial values
    // ------------------------------------------------------
    // Add Default Action Groups
    this.addActionGroup(AgentActionGroup.userInput(this.userInputEnabled));
    this.addActionGroup(AgentActionGroup.codeInterpreter(this.codeInterpreterEnabled));

    // Add specified elems through methods to handle permissions
    // this needs to happen after role creation / assignment
    props.actionGroups?.forEach(ag => {
      this.addActionGroup(ag);
    });

    // Set agent collaboration configuration
    this.agentCollaboration = props.agentCollaboration;
    if (props.agentCollaboration) {
      props.agentCollaboration.collaborators.forEach(ac => {
        this.grantPermissionToAgent(ac);
      });
    }

    if (props.guardrail) {
      this.addGuardrail(props.guardrail);
    }

    // Grant permissions for custom orchestration if provided
    if (this.customOrchestrationExecutor?.lambdaFunction) {
      this.customOrchestrationExecutor.lambdaFunction.grantInvoke(this.role);
      this.customOrchestrationExecutor.lambdaFunction.addPermission(`OrchestrationLambdaInvocationPolicy-${this.node.addr.slice(0, MAX_POLICY_NAME_NODE_LENGTH)}`, {
        principal: new iam.ServicePrincipal('bedrock.amazonaws.com'),
        sourceArn: Lazy.string({ produce: () => this.agentArn }),
        sourceAccount: { Ref: 'AWS::AccountId' } as any,
      });
    }

    // ------------------------------------------------------
    // CFN Props - With Lazy support
    // ------------------------------------------------------
    const cfnProps: bedrock.CfnAgentProps = {
      actionGroups: Lazy.any({ produce: () => this.renderActionGroups() }, { omitEmptyArray: true }),
      agentName: this.name,
      agentResourceRoleArn: this.role.roleArn,
      autoPrepare: props.shouldPrepareAgent ?? false,
      customerEncryptionKeyArn: props.kmsKey?.keyArn,
      description: props.description,
      foundationModel: this.foundationModel.invokableArn,
      guardrailConfiguration: Lazy.any({ produce: () => this.renderGuardrail() }),
      idleSessionTtlInSeconds: this.idleSessionTTL.toSeconds(),
      instruction: props.instruction,
      memoryConfiguration: props.memory?._render(),
      promptOverrideConfiguration: this.promptOverrideConfiguration?._render(),
      skipResourceInUseCheckOnDelete: props.forceDelete ?? false,
      agentCollaboration: props.agentCollaboration?.type,
      agentCollaborators: Lazy.any({ produce: () => this.renderAgentCollaborators() }, { omitEmptyArray: true }),
      customOrchestration: this.renderCustomOrchestration(),
      orchestrationType: this.customOrchestrationExecutor ? OrchestrationType.CUSTOM_ORCHESTRATION : OrchestrationType.DEFAULT,
    };

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    this.__resource = new bedrock.CfnAgent(this, 'Resource', cfnProps);

    this.agentId = this.__resource.attrAgentId;
    this.agentArn = this.__resource.attrAgentArn;
    this.agentVersion = this.__resource.attrAgentVersion;
    this.lastUpdated = this.__resource.attrUpdatedAt;

    // Add explicit dependency between the agent resource and the agent's role default policy
    // See https://github.com/awslabs/generative-ai-cdk-constructs/issues/899
    if (!props.existingRole) {
      // add the appropriate permissions to use the FM
      const grant = this.foundationModel.grantInvoke(this.role);
      grant.applyBefore(this.__resource);
    }

    this.testAlias = AgentAlias.fromAttributes(this, 'DefaultAlias', {
      aliasId: 'TSTALIASID',
      aliasName: 'AgentTestAlias',
      agentVersion: 'DRAFT',
      agent: this,
    });
  }

  // ------------------------------------------------------
  // HELPER METHODS - addX()
  // ------------------------------------------------------

  /**
   * Add guardrail to the agent.
   */
  @MethodMetadata()
  public addGuardrail(guardrail: IGuardrail) {
    // Do some checks
    validation.throwIfInvalid(this.validateGuardrail, guardrail);
    // Add it to the construct
    this.guardrail = guardrail;
    // Handle permissions
    guardrail.grantApply(this.role);
  }

  /**
   * Adds an action group to the agent and configures necessary permissions.
   *
   * @param actionGroup - The action group to add
   * @default - Default permissions:
   * - Lambda function invoke permissions if executor is present
   * - S3 GetObject permissions if apiSchema.s3File is present
   */
  @MethodMetadata()
  public addActionGroup(actionGroup: AgentActionGroup) {
    validation.throwIfInvalid(this.validateActionGroup, actionGroup);
    this.actionGroups.push(actionGroup);
    // Handle permissions to invoke the lambda function
    actionGroup.executor?.lambdaFunction?.grantInvoke(this.role);
    actionGroup.executor?.lambdaFunction?.addPermission(`LambdaInvocationPolicy-${this.node.addr.slice(0, MAX_POLICY_NAME_NODE_LENGTH)}`, {
      principal: new iam.ServicePrincipal('bedrock.amazonaws.com'),
      sourceArn: this.agentArn,
      sourceAccount: { Ref: 'AWS::AccountId' } as any,
    });
    // Handle permissions to access the schema file from S3
    if (actionGroup.apiSchema instanceof AssetApiSchema) {
      const rendered = actionGroup.apiSchema._render();
      if (!('s3' in rendered) || !rendered.s3) {
        throw new ValidationError('S3 configuration is missing in AssetApiSchema', this);
      }
      const s3Config = rendered.s3;
      if (!('s3BucketName' in s3Config) || !('s3ObjectKey' in s3Config)) {
        throw new ValidationError('S3 bucket name and object key are required in AssetApiSchema', this);
      }
      const bucketName = s3Config.s3BucketName;
      const objectKey = s3Config.s3ObjectKey;
      if (!bucketName || bucketName.trim() === '') {
        throw new ValidationError('S3 bucket name cannot be empty in AssetApiSchema', this);
      }
      if (!objectKey || objectKey.trim() === '') {
        throw new ValidationError('S3 object key cannot be empty in AssetApiSchema', this);
      }
      const bucket = s3.Bucket.fromBucketName(this, `${actionGroup.name}SchemaBucket`, bucketName);
      bucket.grantRead(this.role, objectKey);
    } else if (actionGroup.apiSchema instanceof S3ApiSchema) {
      const s3File = actionGroup.apiSchema.s3File;
      if (!s3File) {
        throw new ValidationError('S3 file configuration is missing in S3ApiSchema', this);
      }
      if (!s3File.bucketName || s3File.bucketName.trim() === '') {
        throw new ValidationError('S3 bucket name cannot be empty in S3ApiSchema', this);
      }
      if (!s3File.objectKey || s3File.objectKey.trim() === '') {
        throw new ValidationError('S3 object key cannot be empty in S3ApiSchema', this);
      }
      const bucket = s3.Bucket.fromBucketName(this, `${actionGroup.name}SchemaBucket`, s3File.bucketName);
      bucket.grantRead(this.role, s3File.objectKey);
    }
  }

  /**
   * Grants permissions for an agent collaborator to this agent's role.
   * This method only grants IAM permissions and does not add the collaborator
   * to the agent's collaboration configuration. To add collaborators to the
   * agent configuration, include them in the AgentCollaboration when creating the agent.
   *
   * @param agentCollaborator - The collaborator to grant permissions for
   */
  private grantPermissionToAgent(agentCollaborator: AgentCollaborator) {
    agentCollaborator.grant(this.role);
  }

  /**
   * Configuration for agent collaboration.
   *
   * @default - No collaboration configuration.
   */
  @MethodMetadata()
  public addActionGroups(...actionGroups: AgentActionGroup[]) {
    actionGroups.forEach(ag => this.addActionGroup(ag));
  }

  // ------------------------------------------------------
  // Lazy Renderers
  // ------------------------------------------------------

  /**
   * Render the guardrail configuration.
   *
   * @internal This is an internal core function and should not be called directly.
   */
  private renderGuardrail(): bedrock.CfnAgent.GuardrailConfigurationProperty | undefined {
    return this.guardrail
      ? {
        guardrailIdentifier: this.guardrail.guardrailId,
        guardrailVersion: this.guardrail.guardrailVersion,
      }
      : undefined;
  }

  /**
   * Render the action groups
   *
   * @returns Array of AgentActionGroupProperty objects in CloudFormation format
   * @default - Empty array if no action groups are defined
   * @internal This is an internal core function and should not be called directly.
   */
  private renderActionGroups(): bedrock.CfnAgent.AgentActionGroupProperty[] {
    const actionGroupsCfn: bedrock.CfnAgent.AgentActionGroupProperty[] = [];
    // Build the associations in the CFN format
    this.actionGroups.forEach(ag => {
      actionGroupsCfn.push(ag._render());
    });
    return actionGroupsCfn;
  }

  /**
   * Render the agent collaborators.
   *
   * @returns Array of AgentCollaboratorProperty objects in CloudFormation format, or undefined if no collaborators
   * @default - undefined if no collaborators are defined or array is empty
   * @internal This is an internal core function and should not be called directly.
   */
  private renderAgentCollaborators(): bedrock.CfnAgent.AgentCollaboratorProperty[] | undefined {
    if (!this.agentCollaboration || !this.agentCollaboration.collaborators || this.agentCollaboration.collaborators.length === 0) {
      return undefined;
    }

    return this.agentCollaboration.collaborators.map(ac => ac._render());
  }

  /**
   * Render the custom orchestration.
   *
   * @returns CustomOrchestrationProperty object in CloudFormation format, or undefined if no custom orchestration
   * @default - undefined if no custom orchestration is defined
   * @internal This is an internal core function and should not be called directly.
   */
  private renderCustomOrchestration(): bedrock.CfnAgent.CustomOrchestrationProperty | undefined {
    if (!this.customOrchestrationExecutor) {
      return undefined;
    }

    return {
      executor: {
        lambda: this.customOrchestrationExecutor.lambdaFunction.functionArn,
      },
    };
  }

  // ------------------------------------------------------
  // Validators
  // ------------------------------------------------------
  /**
   * Checks if the Guardrail is valid
   *
   * @param guardrail - The guardrail to validate
   * @returns Array of validation error messages, empty if valid
   */
  private validateGuardrail = (guardrail: IGuardrail) => {
    let errors: string[] = [];
    if (this.guardrail) {
      errors.push(
        `Cannot add Guardrail ${guardrail.guardrailId}. ` +
          `Guardrail ${this.guardrail.guardrailId} has already been specified for this agent.`,
      );
    }
    errors.push(...validation.validateFieldPattern(guardrail.guardrailVersion, 'version', /^(([0-9]{1,8})|(DRAFT))$/));
    return errors;
  };

  /**
   * Check if the action group is valid
   *
   * @param actionGroup - The action group to validate
   * @returns Array of validation error messages, empty if valid
   */
  private validateActionGroup = (actionGroup: AgentActionGroup) => {
    let errors: string[] = [];
    // Find if there is a conflicting action group name
    if (this.actionGroups?.find(ag => ag.name === actionGroup.name)) {
      errors.push('Action group already exists');
    }
    return errors;
  };

  /**
   * Generates a unique, deterministic name for AWS resources that includes a hash component.
   * This method ensures consistent naming while avoiding conflicts and adhering to AWS naming constraints.
   * @param scope - The construct scope used for generating unique names
   * @param prefix - The prefix to prepend to the generated name
   * @param options - Configuration options for name generation
   * @param options.maxLength - Maximum length of the generated name
   * @default - maxLength: 256
   * @param options.lower - Convert the generated name to lowercase
   * @default - lower: false
   * @param options.separator - Character(s) to use between name components
   * @default - separator: ''
   * @param options.allowedSpecialCharacters - String of allowed special characters
   * @default - undefined
   * @param options.destroyCreate - Object to include in hash generation for destroy/create operations
   * @default - undefined
   * @returns A string containing the generated name with format: prefix + hash + separator + uniqueName
   * @throws ValidationError if the generated name would exceed maxLength or if prefix is too long
   * @internal
   */
  private generatePhysicalNameHash(
    scope: IConstruct,
    prefix: string,
    options?: {
      maxLength?: number;
      lower?: boolean;
      separator?: string;
      allowedSpecialCharacters?: string;
      destroyCreate?: any;
    },
  ): string {
    const objectToHash = (obj: any): string => {
      if (obj === undefined) { return ''; }
      const jsonString = JSON.stringify(obj);
      const hash = crypto.createHash('sha256');
      return hash.update(jsonString).digest('hex').slice(0, 7);
    };

    const {
      maxLength = 256,
      lower = false,
      separator = '',
      allowedSpecialCharacters = undefined,
      destroyCreate = undefined,
    } = options ?? {};

    const hash = objectToHash(destroyCreate);
    if (maxLength < (prefix + hash + separator).length) {
      throw new ValidationError('The prefix is longer than the maximum length.', this);
    }

    const uniqueName = Names.uniqueResourceName(
      scope,
      { maxLength: maxLength - (prefix + hash + separator).length, separator, allowedSpecialCharacters },
    );
    const name = `${prefix}${hash}${separator}${uniqueName}`;
    if (name.length > maxLength) {
      throw new ValidationError(`The generated name is longer than the maximum length of ${maxLength}`, this);
    }
    return lower ? name.toLowerCase() : name;
  }

  /**
   * Generates a physical name for the agent.
   * @returns A unique name for the agent with appropriate length constraints
   * @default - Generated name format: 'agent-{hash}-{uniqueName}' with:
   * - maxLength: MAXLENGTH_FOR_ROLE_NAME - '-bedrockagent'.length
   * - lower: true
   * - separator: '-'
   * @protected
   */
  protected generatePhysicalName(): string {
    const maxLength = this.MAXLENGTH_FOR_ROLE_NAME - this.ROLE_NAME_SUFFIX.length;
    return this.generatePhysicalNameHash(this, 'agent', {
      maxLength,
      lower: true,
      separator: '-',
    });
  }
}
