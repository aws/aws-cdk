import { deployIntegTests } from './integration-test-runner';
import { shouldRunIntegTests } from './preflight';

export interface MainConfig {
  endpoint?: string;
  pool?: string;
  atmosphereRoleArn?: string;
  batchSize?: number;
  githubToken?: string;
  githubRepository?: string;
  prNumber?: string;
}

/**
 * Main entry point for integration test deployment.
 * Extracted for testability.
 */
export async function main(config: MainConfig): Promise<void> {
  const { endpoint, pool, atmosphereRoleArn, batchSize, githubToken, githubRepository, prNumber } = config;

  // Run preflight check if GitHub context is available
  if (githubToken && githubRepository && prNumber) {
    // Validate repository format
    const repoParts = githubRepository.split('/');
    if (repoParts.length !== 2 || !repoParts[0] || !repoParts[1]) {
      throw new Error(`Invalid GITHUB_REPOSITORY format: "${githubRepository}". Expected format: owner/repo`);
    }
    const [owner, repo] = repoParts;

    // Validate PR number
    const parsedPrNumber = parseInt(prNumber, 10);
    if (isNaN(parsedPrNumber) || parsedPrNumber <= 0) {
      throw new Error(`Invalid PR number: "${prNumber}". Expected a positive integer.`);
    }

    console.log(`Running preflight check for PR #${parsedPrNumber}...`);

    const preflight = await shouldRunIntegTests({
      githubToken,
      owner,
      repo,
      prNumber: parsedPrNumber,
    });

    console.log(`Preflight result: ${preflight.reason}`);

    if (!preflight.shouldRun) {
      console.log('Skipping integration test deployment.');
      return;
    }
  } else {
    console.log('GitHub context not available, skipping preflight check (manual run or workflow_dispatch)');
  }

  // Validate required environment variables for deployment
  if (!endpoint) {
    throw new Error('CDK_ATMOSPHERE_ENDPOINT environment variable is required');
  }

  if (!pool) {
    throw new Error('CDK_ATMOSPHERE_POOL environment variable is required');
  }

  if (!atmosphereRoleArn) {
    throw new Error('CDK_ATMOSPHERE_OIDC_ROLE environment variable is required');
  }

  await deployIntegTests({ atmosphereRoleArn, endpoint, pool, batchSize });
}
