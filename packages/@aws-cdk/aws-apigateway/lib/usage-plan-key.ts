import cdk = require('@aws-cdk/cdk');
import { ApiKey } from './api-key';
import { cloudformation } from './apigateway.generated';
import { UsagePlan } from './usage-plan';

export interface UsagePlanKeyProps {
  /**
   * Represents the clients to apply a Usage Plan
   */
  apiKey: ApiKey;

  /**
   * Usage Plan to be associated.
   */
  usagePlan: UsagePlan;
}

/**
 * Type of Usage Plan Key. Currently the only supported type is 'API_KEY'
 */
export enum UsagePlanKeyType {
  ApiKey = 'API_KEY'
}

/**
 * Associates client with an API Gateway Usage Plan.
 */
export class UsagePlanKey extends cdk.Construct {
  constructor(parent: cdk.Construct, name: string, props: UsagePlanKeyProps) {
    super(parent, name);

    new cloudformation.UsagePlanKeyResource(this, 'Resource', {
      keyId: props.apiKey.keyId,
      keyType: UsagePlanKeyType.ApiKey,
      usagePlanId: props.usagePlan.usagePlanId
    });
  }
}
