import { IFunction } from 'aws-cdk-lib/aws-lambda';
import { GatewayTargetBase } from './base-class';
import { Construct } from 'constructs';
import { GatewayTargetProtocolType, IMcpGatewayTarget, McpGatewayTargetCommonProps, McpTargetType } from './target';
import { IGateway } from '../gateway';
import { GatewayCredentialProvider, IGatewayCredentialProvider } from '../outbound-auth/credential-provider';
import { ToolSchema } from './schema/tool-schema';
import { CfnGatewayTarget } from 'aws-cdk-lib/aws-bedrockagentcore';

/**
 * Properties for creating a GatewayTarget resource
 */
export interface McpLambdaTargetProps extends McpGatewayTargetCommonProps {
  /**
   * The function to associate to the gateway
   */
  readonly lambdaFunction: IFunction;

  /**
   * The schema
   */
  readonly schema: ToolSchema;
}

export interface McpLambdaTargetAssociationProps extends McpLambdaTargetProps {
  /**
   * The gateway to create a target for.
   */
  readonly gateway: IGateway;
}

export class McpLambdaTarget extends GatewayTargetBase implements IMcpGatewayTarget {
  public readonly targetType: McpTargetType = McpTargetType.LAMBDA;
  public readonly targetProtocolType: GatewayTargetProtocolType = GatewayTargetProtocolType.MCP;
  // from props
  public readonly name: string;
  public readonly description?: string;
  public readonly gateway: IGateway;
  public readonly credentialProviders: IGatewayCredentialProvider[];
  public readonly lambdaFunction: IFunction;
  public readonly schema: ToolSchema;

  // returned from resource
  public readonly targetArn: string;
  public readonly targetId: string;
  public readonly status?: string;
  public readonly createdAt?: string;
  public readonly updatedAt?: string;

  constructor(scope: Construct, id: string, props: McpLambdaTargetAssociationProps) {
    super(scope, id);
    // ------------------------------------------------------
    // Assignments
    // ------------------------------------------------------
    this.name = props.name;
    this.description = props.description;
    this.gateway = props.gateway;
    // Lambda target does not support any other credential provider which is not IAM
    this.credentialProviders = [GatewayCredentialProvider.iamRole()];
    this.lambdaFunction = props.lambdaFunction;
    this.schema = props.schema;

    // bindings
    this.schema._bind(this);

    // ------------------------------------------------------
    // Permissions
    // ------------------------------------------------------
    // Allow gateway to retrieve schema from S3 if not inline
    this.schema.grantPermissionsToRole(this.gateway.role);
    // Allow gateway role to invoke Lambda
    this.lambdaFunction.grantInvoke(this.gateway.role);

    // ------------------------------------------------------
    // L1 Instantiation
    // ------------------------------------------------------
    // Create Lambda function for custom resource using NodejsFunction

    const _resource = new CfnGatewayTarget(this, 'Resource', {
      credentialProviderConfigurations: this.credentialProviders.flatMap((provider) => provider.render()),
      description: this.description,
      gatewayIdentifier: this.gateway.gatewayId,
      name: this.name,
      targetConfiguration: {
        mcp: {
          lambda: {
            lambdaArn: this.lambdaFunction.functionArn,
            toolSchema: this.schema._render(),
          },
        },
      },
    });

    // ------------------------------------------------------
    // Permissions
    // ------------------------------------------------------
    for (const provider of this.credentialProviders) {
      // Add permissions
      provider
        .grantNeededPermissionsToRole(this.gateway.role)
        // Apply the policy permissions before creating the target resource
        ?.applyBefore(_resource);
    }

    // ------------------------------------------------------
    // Assignments
    // ------------------------------------------------------
    this.targetId = _resource.getAtt('TargetId').toString();
    this.targetArn = _resource.getAtt('TargetArn').toString();
    this.status = _resource.getAtt('Status').toString();
    this.createdAt = _resource.getAtt('CreatedAt').toString();
    this.updatedAt = _resource.getAtt('UpdatedAt').toString();

    // ------------------------------------------------------
  }
}
