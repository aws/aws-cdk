#!/usr/bin/env node
import { main } from '../lib/main';

main({
  endpoint: process.env.CDK_ATMOSPHERE_ENDPOINT,
  pool: process.env.CDK_ATMOSPHERE_POOL,
  atmosphereRoleArn: process.env.CDK_ATMOSPHERE_OIDC_ROLE,
  batchSize: process.env.CDK_ATMOSPHERE_BATCH_SIZE !== undefined ? Number.parseInt(process.env.CDK_ATMOSPHERE_BATCH_SIZE) : undefined,
  githubToken: process.env.GITHUB_TOKEN,
  githubRepository: process.env.GITHUB_REPOSITORY,
  prNumber: process.env.PR_NUMBER,
}).catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
