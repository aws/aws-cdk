import type { IConstruct } from 'constructs';
import { Lazy, Stack } from '../../../core';

/**
 * Number of generated characters BedrockAgentCore appends to a gateway name to form the gateway
 * id that appears in the gateway ARN.
 *
 * A gateway ARN is `gateway/<id>`, and the id is the gateway name, lowercased, followed by a
 * hyphen and exactly this many lowercase alphanumeric characters. Both the length and the
 * lowercasing come from the documented ARN pattern,
 * `gateway/(0-9a-z?){1,48}-[a-z0-9]{10}`, and CloudFormation documents the same shape by
 * example, returning ids such as `my-gateway-a1b2c3d4e5` from `Ref`.
 *
 * @see https://docs.aws.amazon.com/bedrock-agentcore/latest/APIReference/API_HarnessAgentCoreGatewayConfig.html
 * @see https://docs.aws.amazon.com/AWSCloudFormation/latest/TemplateReference/aws-resource-bedrockagentcore-gateway.html
 */
const GATEWAY_ID_SUFFIX_LENGTH = 10;

/**
 * Options for `gatewayArnPatternForName`.
 *
 * @internal
 */
export interface GatewayArnPatternOptions {
  /**
   * Whether a name containing a CloudFormation dynamic reference (`{{resolve:...}}`) counts as
   * only known at deployment.
   *
   * A dynamic reference resolves to its reference text during synthesis, and CloudFormation
   * substitutes the value only at deployment, so lowercasing the text does not lowercase the name.
   *
   * @default false - the reference text is lowercased like any other resolved name
   */
  readonly dynamicReferenceIsDeployTime?: boolean;
}

/**
 * An ARN pattern, in the account and region of `scope`, that matches the ARN of the gateway
 * with the given name and no other gateway.
 *
 * Resolution is deferred to synthesis rather than branching on `Token.isUnresolved`, which cannot
 * tell an auto-generated name that resolves during synthesis from a deploy-time value. A resolved
 * name is lowercased and its generated suffix matched by length, because the ARN carries the
 * lowercased name plus GATEWAY_ID_SUFFIX_LENGTH characters and IAM matches ARNs case sensitively.
 * A name only known at deployment cannot be lowercased, so the pattern then matches every gateway
 * in that account and region.
 *
 * @internal
 */
export function gatewayArnPatternForName(
  scope: IConstruct,
  gatewayName: string,
  options: GatewayArnPatternOptions = {},
): string {
  const stack = Stack.of(scope);
  return stack.formatArn({
    service: 'bedrock-agentcore',
    resource: 'gateway',
    resourceName: Lazy.string({
      produce: () => {
        const resolvedName = stack.resolve(gatewayName);
        const knownAtSynthesis = typeof resolvedName === 'string'
          && !(options.dynamicReferenceIsDeployTime && resolvedName.includes('{{resolve:'));
        return knownAtSynthesis
          ? `${resolvedName.toLowerCase()}-${'?'.repeat(GATEWAY_ID_SUFFIX_LENGTH)}`
          : '*';
      },
    }),
  });
}
