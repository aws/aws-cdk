import { CustomClaimOperator, CustomClaimValueType } from './types';

/**
 * Builds the CloudFormation claim match value object.
 * Caller is responsible for validation before calling this.
 * @internal
 */
export function buildClaimMatchValue(
  valueType: CustomClaimValueType,
  operator: CustomClaimOperator,
  value: string | string[],
): { matchValueString?: string; matchValueStringList?: string[] } {
  if (valueType === CustomClaimValueType.STRING || operator === CustomClaimOperator.CONTAINS) {
    return { matchValueString: Array.isArray(value) ? value[0] : value };
  }
  return { matchValueStringList: value as string[] };
}

/**
 * Renders a full custom claim property object for CloudFormation.
 * @internal
 */
export function renderCustomClaim(
  name: string,
  valueType: CustomClaimValueType,
  operator: CustomClaimOperator,
  value: string | string[],
): any {
  return {
    inboundTokenClaimName: name,
    inboundTokenClaimValueType: valueType,
    authorizingClaimMatchValue: {
      claimMatchOperator: operator,
      claimMatchValue: buildClaimMatchValue(valueType, operator, value),
    },
  };
}
