/******************************************************************************
 *                                 IAM Role
 *****************************************************************************/

import type { ICredentialProviderConfig } from './credential-provider';
import { CredentialProviderType } from './credential-provider';
import type { CfnGatewayTarget } from '../../../../aws-bedrockagentcore';
import type { Grant } from '../../../../aws-iam';
import { UnscopedValidationError } from '../../../../core/lib/errors';
import { lit } from '../../../../core/lib/helpers-internal';
import { validateStringFieldLength, validateFieldPattern } from '../../common/validation-helpers';
import type { IGateway } from '../gateway-base';

/**
 * Properties for configuring the IAM role credential provider.
 *
 * When a target is authenticated via the gateway's execution role, the gateway signs
 * outbound requests with SigV4. These properties let you tell the gateway which AWS
 * service and region to sign for, instead of letting it infer them from the target
 * endpoint.
 */
export interface GatewayIamRoleCredentialProviderProps {
  /**
   * The AWS service name used for SigV4 signing of outbound requests.
   *
   * Use the SigV4 signing name (typically the endpoint prefix), e.g.
   * `bedrock-runtime`, `s3`, `execute-api`, `dynamodb`.
   * Can be up to 64 characters long.
   *
   * Pattern: ^[a-zA-Z0-9._-]+$
   *
   * @default - Gateway infers the service from the target endpoint
   * @see https://docs.aws.amazon.com/service-authorization/latest/reference/reference_policies_actions-resources-contextkeys.html
   */
  readonly service?: string;

  /**
   * The AWS Region used for SigV4 signing of outbound requests.
   * Can be up to 32 characters long.
   *
   * Pattern: ^[a-zA-Z0-9-]+$
   *
   * @default - Gateway's own Region
   */
  readonly region?: string;
}

/**
 * Gateway IAM Role credential provider configuration implementation
 * Bare (no service/region) works with any target type; explicit service/region
 * is only valid for MCP Server and OpenAPI targets
 * @internal
 */
export class GatewayIamRoleCredentialProviderConfig implements ICredentialProviderConfig {
  public readonly credentialProviderType = CredentialProviderType.GATEWAY_IAM_ROLE;
  /**
   * The AWS service name used for SigV4 signing.
   */
  public readonly service?: string;
  /**
   * The AWS region used for SigV4 signing.
   */
  public readonly region?: string;

  constructor(props: GatewayIamRoleCredentialProviderProps = {}) {
    this.service = props.service;
    this.region = props.region;
    this.validate();
  }

  /**
   * @internal
   */
  _render(): CfnGatewayTarget.CredentialProviderConfigurationProperty {
    if (this.service === undefined) {
      return {
        credentialProviderType: this.credentialProviderType,
      };
    }

    return {
      credentialProviderType: this.credentialProviderType,
      credentialProvider: {
        iamCredentialProvider: {
          service: this.service,
          region: this.region,
        },
      },
    };
  }

  /**
   * No-op for IAM role authentication - no additional permissions are required.
   * When using IAM role authentication for outbound calls, the gateway uses its own execution
   * role to authenticate with the target endpoint. Unlike API Key and OAuth credential providers
   * which require permissions to access external credential stores (Secrets Manager, Token Vault),
   * IAM role authentication leverages AWS IAM's native authentication without additional resources.
   * @param _gateway The gateway (unused - no credential provider permissions needed)
   * @returns undefined - no additional credential provider permissions to grant
   */
  grantNeededPermissionsToRole(_gateway: IGateway): Grant | undefined {
    return undefined;
  }

  private validate(): void {
    if (this.region !== undefined && this.service === undefined) {
      throw new UnscopedValidationError(
        lit`IamCredentialProviderServiceRequired`,
        'service must be provided when region is specified for the IAM credential provider',
      );
    }

    const errors: string[] = [];

    if (this.service !== undefined) {
      errors.push(...validateStringFieldLength({
        value: this.service,
        fieldName: 'IAM credential provider service',
        minLength: 1,
        maxLength: 64,
      }));
      errors.push(...validateFieldPattern(
        this.service,
        'IAM credential provider service',
        /^[a-zA-Z0-9._-]+$/,
      ));
    }

    if (this.region !== undefined) {
      errors.push(...validateStringFieldLength({
        value: this.region,
        fieldName: 'IAM credential provider region',
        minLength: 1,
        maxLength: 32,
      }));
      errors.push(...validateFieldPattern(
        this.region,
        'IAM credential provider region',
        /^[a-zA-Z0-9-]+$/,
      ));
    }

    if (errors.length > 0) {
      throw new UnscopedValidationError(lit`IamCredentialProviderInvalid`, errors.join('\n'));
    }
  }
}
