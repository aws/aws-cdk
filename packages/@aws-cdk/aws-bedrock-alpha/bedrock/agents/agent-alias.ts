import { ArnFormat, aws_bedrock as bedrock, IResource, Resource, Stack } from 'aws-cdk-lib';
import * as events from 'aws-cdk-lib/aws-events';
import * as iam from 'aws-cdk-lib/aws-iam';
import { addConstructMetadata } from 'aws-cdk-lib/core/lib/metadata-resource';
import { propertyInjectable } from 'aws-cdk-lib/core/lib/prop-injectable';
import { Construct } from 'constructs';
import { IAgent } from './agent';

/******************************************************************************
 *                              COMMON
 *****************************************************************************/
/**
 * Represents an Agent Alias, either created with CDK or imported.
 */
export interface IAgentAlias extends IResource {
  /**
   * The unique identifier of the agent alias.
   * @attributes
   */
  readonly aliasId: string;
  /**
   * The ARN of the agent alias.
   * @attributes
   */
  readonly aliasArn: string;
  /**
   * The underlying agent for this alias.
   */
  readonly agent: IAgent;

  /**
   * Grant the given principal identity permissions to perform actions on this agent alias.
   */
  grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant;

  /**
   * Grant the given identity permissions to invoke the agent alias.
   */
  grantInvoke(grantee: iam.IGrantable): iam.Grant;

  /**
   * Grant the given identity permissions to get the agent alias.
   */
  grantGet(grantee: iam.IGrantable): iam.Grant;

  /**
   * Define an EventBridge rule that triggers when something happens to this agent alias
   *
   * Requires that there exists at least one CloudTrail Trail in your account
   * that captures the event. This method will not create the Trail.
   *
   * @param id The id of the rule
   * @param options Options for adding the rule
   */
  onCloudTrailEvent(id: string, options?: events.OnEventOptions): events.Rule;
}

/******************************************************************************
 *                        ABSTRACT BASE CLASS
 *****************************************************************************/
/**
 * Abstract base class for an Agent.
 * Contains methods and attributes valid for Agents either created with CDK or imported.
 */
export abstract class AgentAliasBase extends Resource implements IAgentAlias {
  public abstract readonly aliasId: string;
  public abstract readonly aliasArn: string;
  public abstract readonly agent: IAgent;

  /**
   * Grant the given principal identity permissions to perform actions on this agent alias.
   * Note: This grant will only work when the grantee is in the same AWS account
   * where the agent alias is defined. Cross-account grant is not supported.
   */
  public grant(grantee: iam.IGrantable, ...actions: string[]): iam.Grant {
    return iam.Grant.addToPrincipal({
      grantee,
      actions,
      resourceArns: [this.aliasArn],
      scope: this,
    });
  }

  /**
   * Grant the given identity permissions to invoke the agent alias.
   * Note: This grant will only work when the grantee is in the same AWS account
   * where the agent alias is defined. Cross-account invocation is not supported.
   */
  public grantInvoke(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'bedrock:InvokeAgent');
  }

  /**
   * Grant the given identity permissions to get the agent alias.
   * Note: This grant will only work when the grantee is in the same AWS account
   * where the agent alias is defined. Cross-account agent read is not supported.
   */
  public grantGet(grantee: iam.IGrantable): iam.Grant {
    return this.grant(grantee, 'bedrock:GetAgentAlias');
  }

  /**
   * Define an EventBridge rule that triggers when something happens to this agent alias
   *
   * Requires that there exists at least one CloudTrail Trail in your account
   * that captures the event. This method will not create the Trail.
   *
   * @param id The id of the rule
   * @param options Options for adding the rule
   */
  public onCloudTrailEvent(id: string, options: events.OnEventOptions = {}): events.Rule {
    const rule = new events.Rule(this, id, options);
    rule.addTarget(options.target);
    rule.addEventPattern({
      source: ['aws.bedrock'],
      detailType: ['AWS API Call via CloudTrail'],
      detail: {
        requestParameters: {
          agentAliasId: [this.aliasId],
        },
      },
    });
    return rule;
  }
}

/******************************************************************************
 *                        PROPS FOR NEW CONSTRUCT
 *****************************************************************************/
/**
 * Properties for creating a CDK-Managed Agent Alias.
 */
export interface AgentAliasProps {
  /**
   * The name for the agent alias.
   * This will be used as the physical name of the agent alias.
   *
   * @default - "latest"
   */
  readonly agentAliasName?: string;
  /**
   * The version of the agent to associate with the agent alias.
   *
   * @default - Creates a new version of the agent.
   */
  readonly agentVersion?: string;
  /**
   * The agent associated to this alias.
   */
  readonly agent: IAgent;
  /**
   * Description for the agent alias.
   * @default undefined - No description is provided
   */
  readonly description?: string;
}

/******************************************************************************
 *                      ATTRS FOR IMPORTED CONSTRUCT
 *****************************************************************************/
/**
 * Attributes needed to create an import
 */
export interface AgentAliasAttributes {
  /**
   * The Id of the agent alias.
   */
  readonly aliasId: string;
  /**
   * The name of the agent alias.
   * @default undefined - No alias name is provided
   */
  readonly aliasName?: string;
  /**
   * The underlying agent for this alias.
   */
  readonly agent: IAgent;
  /**
   * The agent version for this alias.
   */
  readonly agentVersion: string;
}

/******************************************************************************
 *                        NEW CONSTRUCT DEFINITION
 *****************************************************************************/
/**
 * Class to create an Agent Alias with CDK.
 * @cloudformationResource AWS::Bedrock::AgentAlias
 */
@propertyInjectable
export class AgentAlias extends AgentAliasBase {
  /** Uniquely identifies this class. */
  public static readonly PROPERTY_INJECTION_ID: string = '@aws-cdk.aws-bedrock-alpha.AgentAlias';
  // ------------------------------------------------------
  // Imports
  // ------------------------------------------------------
  /**
   * Brings an Agent Alias from an existing one created outside of CDK.
   */
  public static fromAttributes(
    scope: Construct,
    id: string,
    attrs: AgentAliasAttributes,
  ): IAgentAlias {
    class Import extends AgentAliasBase {
      public readonly agent = attrs.agent;
      public readonly aliasId = attrs.aliasId;
      public readonly aliasName = attrs.aliasName;
      public readonly aliasArn = Stack.of(scope).formatArn({
        resource: 'agent-alias',
        service: 'bedrock',
        resourceName: `${attrs.agent.agentId}/${attrs.aliasId}`,
        arnFormat: ArnFormat.SLASH_RESOURCE_NAME,
      });
    }
    return new Import(scope, id);
  }

  // ----------------------------------------
  // Inherited Attributes
  // ----------------------------------------
  public readonly agent: IAgent;
  public readonly aliasId: string;
  public readonly aliasArn: string;
  /**
   * The name of the agent alias.
   * This is either provided by the user or generated from a hash.
   */
  public readonly aliasName: string;

  // ------------------------------------------------------
  // CONSTRUCTOR
  // ------------------------------------------------------
  constructor(scope: Construct, id: string, props: AgentAliasProps) {
    super(scope, id);
    // Enhanced CDK Analytics Telemetry
    addConstructMetadata(this, props);

    // ------------------------------------------------------
    // Set properties or defaults
    // ------------------------------------------------------
    // see https://github.com/awslabs/generative-ai-cdk-constructs/issues/947 - The default name without any version update may result in this error.
    // see https://github.com/awslabs/generative-ai-cdk-constructs/pull/1116 - If no agent version is provided then update the agent description for a new version.
    this.aliasName = props.agentAliasName ?? 'latest';
    this.agent = props.agent;

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    const alias = new bedrock.CfnAgentAlias(this, 'Resource', {
      agentAliasName: this.aliasName,
      agentId: this.agent.agentId,
      description: props.description,
      routingConfiguration: props.agentVersion
        ? [
          {
            agentVersion: props.agentVersion,
          },
        ]
        : undefined,
    });

    this.aliasId = alias.attrAgentAliasId;
    this.aliasArn = alias.attrAgentAliasArn;
  }
}
