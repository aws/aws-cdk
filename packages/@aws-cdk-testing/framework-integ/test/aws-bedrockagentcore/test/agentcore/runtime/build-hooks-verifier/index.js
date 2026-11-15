/* eslint-disable */
// Plain .js on purpose: bundled by esbuild at synth, and kept out of the package's tsc build (which
// compiles only **/*.ts). It pins a current bedrock-agentcore-control SDK whose model includes
// hooksConfiguration and resourceConfigurations.
const { BedrockAgentCoreControlClient, GetAgentRuntimeCommand } = require('@aws-sdk/client-bedrock-agentcore-control');

const client = new BedrockAgentCoreControlClient({});

// Returns "<hook path>:<hook port>:<minimum memory MiB>" for the deployed runtime.
exports.handler = async (event) => {
  const res = await client.send(new GetAgentRuntimeCommand({ agentRuntimeId: event.agentRuntimeId }));
  const httpPost = res.hooksConfiguration?.build?.warmup?.action?.httpPost;
  const memory = res.resourceConfigurations?.[0]?.minimumMemoryInMiB;
  const summary = `${httpPost?.path}:${httpPost?.port}:${memory}`;
  console.log(`GetAgentRuntime returned ${summary}`);
  return summary;
};
