/* eslint-disable */
// Plain .js on purpose: bundled by esbuild at synth, and kept out of the package's tsc build (which
// compiles only **/*.ts). It pins a current bedrock-agentcore-control SDK whose model includes
// platformVersion; type-checking it would clash with the repo's older hoisted @smithy types.
const { BedrockAgentCoreControlClient, GetAgentRuntimeCommand } = require('@aws-sdk/client-bedrock-agentcore-control');

const client = new BedrockAgentCoreControlClient({});

// Returns the deployed runtime's platformVersion (e.g. "V1" / "V2").
exports.handler = async (event) => {
  const res = await client.send(new GetAgentRuntimeCommand({ agentRuntimeId: event.agentRuntimeId }));
  console.log(`GetAgentRuntime returned platformVersion=${res.platformVersion}`);
  return res.platformVersion;
};
