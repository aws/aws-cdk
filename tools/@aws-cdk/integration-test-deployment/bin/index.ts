#!/usr/bin/env node
import { deployIntegTests } from '../lib/integration-test-runner';

const endpoint = process.env.CDK_ATMOSPHERE_ENDPOINT;
const pool = process.env.CDK_ATMOSPHERE_POOL;
const atmosphereRoleArn = process.env.CDK_ATMOSPHERE_OIDC_ROLE;
const batchSize = process.env.CDK_ATMOSPHERE_BATCH_SIZE !== undefined ? Number.parseInt(process.env.CDK_ATMOSPHERE_BATCH_SIZE) : undefined;

if (!endpoint) {
  throw new Error('CDK_ATMOSPHERE_ENDPOINT environment variable is required');
}

if (!pool) {
  throw new Error('CDK_ATMOSPHERE_POOL environment variable is required');
}

if (!atmosphereRoleArn) {
  throw new Error('CDK_ATMOSPHERE_OIDC_ROLE environment variable is required');
}

deployIntegTests({ atmosphereRoleArn, endpoint, pool, batchSize }).catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
