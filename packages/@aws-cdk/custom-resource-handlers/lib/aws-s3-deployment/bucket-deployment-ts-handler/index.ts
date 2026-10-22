/**
 * `Custom::CDKBucketDeployment` provider.
 *
 * A TypeScript reimplementation of the provider specified in
 * `BUCKET_DEPLOYMENT_CONTRACT.md`, using the AWS SDK directly rather than shelling out to
 * the AWS CLI. Section references below point at that document.
 *
 * Where the contract's §10 (*implementation artifacts*) described behavior of the previous
 * Python implementation, this one is free to differ, and does so wherever the artifact was
 * a defect from `BUCKET_DEPLOYMENT_BUGS.md`. Each such place is marked with its `B` number.
 * Notable ones:
 *
 * - **B1**: objects are uploaded unconditionally instead of going through `aws s3 sync`'s
 *   size/mtime comparator, so a same-size content change is never silently dropped.
 * - **B2**: the destination prefix is normalized once, so recursive deletion cannot reach
 *   keys that merely share a string prefix.
 * - **B3/B4**: the ownership guard fails closed and also covers the `Update` path.
 * - **B5/B6**: every outcome produces a CloudFormation response; there is no path that
 *   returns without responding.
 * - **B7/B11/B12**: property parsing is uniform, and a malformed request fails instead of
 *   silently selecting a destructive or partial behavior.
 * - **B21**: an underlying AWS error reaches the caller's stack events, rather than being
 *   reduced to a subprocess exit status.
 */
import { randomUUID } from 'crypto';
import { CloudFrontClient } from '@aws-sdk/client-cloudfront';
import { S3Client } from '@aws-sdk/client-s3';
import { CloudFrontInvalidator } from './cloudfront';
import { compileFilters } from './filters';
import { toMetadataFields } from './metadata';
import type { DeploymentRequest } from './request';
import { normalizePrefix, parseRequest } from './request';
import { S3Deployment } from './s3';
import { makeHandler } from '../../nodejs-entrypoint';

/**
 * Overridable collaborators.
 *
 * Tests replace the clients with in-memory fakes and shorten the invalidation waiter;
 * production uses the defaults.
 */
export const external = {
  s3: () => new S3Client({}),
  cloudfront: () => new CloudFrontClient({ maxAttempts: 10 }),
  invalidator: (client: CloudFrontClient) => new CloudFrontInvalidator(client),
};

/** The `Data` block of the response (contract §7). */
interface ResponseData {
  DestinationBucketArn?: string;
  SourceObjectKeys: string[];
  SourceObjectVersionIds?: string[];
}

export async function onEvent(event: AWSLambda.CloudFormationCustomResourceEvent) {
  // Checked before anything else so a malformed request cannot mutate the destination
  // (contract §3.1). On Update the entrypoint would not otherwise catch this.
  if (event.RequestType !== 'Create' && !(event as any).PhysicalResourceId) {
    throw new Error(
      `invalid request: request type is '${event.RequestType}' but 'PhysicalResourceId' is not defined`,
    );
  }

  const request = parseRequest(event.ResourceProperties);

  const s3 = new S3Deployment(external.s3());
  const data: ResponseData = {
    // Pure dependency plumbing: echoed so a template can create a GetAtt edge.
    DestinationBucketArn: request.destinationBucketArn,
    SourceObjectKeys: request.outputObjectKeys ? request.sourceObjectKeys : [],
  };

  switch (event.RequestType) {
    case 'Create':
    case 'Update': {
      if (event.RequestType === 'Update') {
        await deleteOldDestination(s3, event, request);
      }

      const versionIds = await deploy(s3, request);

      if (request.outputObjectVersionIds) {
        data.SourceObjectVersionIds = versionIds;
      }
      break;
    }

    case 'Delete': {
      await deleteDestination(s3, request);

      // Always present when requested, so `Fn::GetAtt` on it never fails — even though no
      // lookup ran (contract §7).
      if (request.outputObjectVersionIds) {
        data.SourceObjectVersionIds = [];
      }
      break;
    }
  }

  // Invalidation happens on every request type that names a distribution (contract §3.6),
  // including a retaining Delete that changed nothing.
  if (request.distributionId) {
    await invalidate(request, event.RequestId);
  }

  return {
    // Only Create allocates an id; Update and Delete relay the incoming one, which the
    // entrypoint does for us when we return nothing.
    PhysicalResourceId: event.RequestType === 'Create' ? `aws.cdk.s3deployment.${randomUUID()}` : undefined,
    NoEcho: false,
    Data: data,
  };
}

/**
 * Deploy the sources, returning version ids positionally aligned with `SourceObjectKeys`.
 */
async function deploy(s3: S3Deployment, request: DeploymentRequest): Promise<string[]> {
  if (request.outputObjectVersionIds && request.extract) {
    // With extraction on there is no 1:1 mapping from a source to a deployed object, so
    // every id would be meaningless. The original returned a list of empty strings, which
    // is indistinguishable from an unversioned bucket (B17).
    throw new Error(
      "'OutputObjectVersionIds' requires 'Extract' to be false: with extraction on, a source archive does not map to a single deployed object",
    );
  }

  const filters = compileFilters(request.exclude, request.include);
  const metadata = toMetadataFields(request.userMetadata, request.systemMetadata);

  const staged = await s3.stage(request);
  const result = await s3.deploy(request, staged, filters, metadata);

  // A source that every filter rejected has no object and therefore no version id; the
  // empty string is the documented stand-in (contract §3.5).
  return request.sources.map((_, index) => result.versionIdsBySource.get(index) ?? '');
}

/** Remove the previous destination when an `Update` moves it (contract §3.3). */
async function deleteOldDestination(
  s3: S3Deployment,
  event: AWSLambda.CloudFormationCustomResourceEvent,
  request: DeploymentRequest,
): Promise<void> {
  if (request.retainOnDelete) { return; }

  const oldProps = (event as any).OldResourceProperties as Record<string, any> | undefined;
  if (!oldProps?.DestinationBucketName) {
    // The original logged a warning and returned without responding at all, hanging the
    // stack until the custom-resource timeout (B5). Failing is strictly better: it is
    // visible, and the caller can fix the request.
    throw new Error(
      "an Update with 'RetainOnDelete' disabled needs 'OldResourceProperties' to know which destination to clean up",
    );
  }

  const oldBucket = String(oldProps.DestinationBucketName);
  const oldPrefix = normalizePrefix(oldProps.DestinationBucketKeyPrefix);
  const oldRawPrefix = oldProps.DestinationBucketKeyPrefix === undefined
    ? ''
    : String(oldProps.DestinationBucketKeyPrefix);

  const unchanged = oldBucket === request.destinationBucketName
    && oldPrefix === request.destinationBucketKeyPrefix;
  if (unchanged) {
    // Reconciliation of an unchanged destination is `Prune`'s job, not a separate deletion.
    return;
  }

  // The original skipped this check on the Update path, so a prefix another deployment
  // still owned was emptied anyway (B4).
  if (await s3.isOwnedElsewhere(oldBucket, oldPrefix, oldRawPrefix)) { return; }

  await s3.deletePrefix(oldBucket, oldPrefix);
}

/** Handle a `Delete` request (contract §3.4). */
async function deleteDestination(s3: S3Deployment, request: DeploymentRequest): Promise<void> {
  if (request.retainOnDelete) { return; }

  const owned = await s3.isOwnedElsewhere(
    request.destinationBucketName,
    request.destinationBucketKeyPrefix,
    request.rawKeyPrefix,
  );
  if (owned) { return; }

  await s3.deletePrefix(request.destinationBucketName, request.destinationBucketKeyPrefix);
}

async function invalidate(request: DeploymentRequest, requestId: string): Promise<void> {
  const client = external.cloudfront();
  await external.invalidator(client).invalidate({
    distributionId: request.distributionId!,
    paths: request.distributionPaths,
    wait: request.waitForDistributionInvalidation,
    requestId,
  });
}

export const handler = makeHandler(onEvent);
