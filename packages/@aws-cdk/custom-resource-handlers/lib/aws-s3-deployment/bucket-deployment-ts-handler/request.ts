/**
 * Turning a CloudFormation request into a list of actions to perform.
 *
 * Everything that can be decided by looking at the request alone is decided here:
 * property parsing, validation, prefix normalization, and which of the request types
 * implies which work. What comes out is a flat, self-contained list that the handler
 * executes in order, so the whole lifecycle is readable in one place rather than spread
 * across branches in the executor.
 *
 * Decisions that need to observe the destination — notably whether another deployment
 * still owns a prefix — cannot be made here and stay with the action that performs them.
 *
 * CloudFormation stringifies custom-resource properties, so booleans arrive as the strings
 * `"true"`/`"false"`. This module is the single place that knows that.
 */
import type { Filters } from './filters';
import { compileFilters } from './filters';
import type { MarkersConfig } from './markers';
import type { PartialPutObjectRequest } from './metadata';
import { parseMetadataFields } from './metadata';

/** One source object to read. */
export interface SourceSpec {
  readonly bucketName: string;
  readonly objectKey: string;
  readonly markers: Record<string, unknown>;
  readonly markersConfig?: MarkersConfig;
}

/** Where objects go, and the prefix spellings needed to get there safely. */
export interface Destination {
  readonly bucketName: string;

  /**
   * Normalized: either empty, or ending in `/`.
   *
   * Normalizing once is what keeps deployment and deletion scoped identically. A prefix
   * used verbatim would make `app` mean the path `app/` when deploying but the string
   * `app` when deleting, which also matches `apple/` and `appendix.txt`.
   */
  readonly keyPrefix: string;

  /**
   * The prefix exactly as the caller spelled it.
   *
   * Only used for ownership-tag matching: the tag a `BucketDeployment` writes embeds the
   * caller's spelling, so a guard that only knew the normalized form would fail to see a
   * tag written for an unslashed prefix and would delete content that is in fact owned.
   */
  readonly rawKeyPrefix: string;
}

/** Read the sources and make the destination mirror them. */
export interface CopySourcesAction {
  readonly type: 'copy-sources';
  readonly sources: SourceSpec[];
  /** Expand each source as a zip archive, rather than deploying it as an opaque object. */
  readonly extract: boolean;
  readonly destination: Destination;
  /** Delete destination objects under the prefix that the sources do not account for. */
  readonly prune: boolean;
  /**
   * Which staged files to deploy, and which destination objects pruning may remove.
   *
   * Compiled from `Exclude`/`Include` here rather than at execution time: the patterns
   * depend only on the request, so a bad one is better found before anything is read or
   * written.
   */
  readonly filters: Filters;
  readonly putObjectSettings: PartialPutObjectRequest;
  /**
   * When set, the version ids of the deployed objects are reported under this response
   * key, positionally aligned with `sources`.
   */
  readonly reportVersionIdsAs?: string;
}

/**
 * Recursively delete everything under a prefix, unless another deployment owns it.
 *
 * The ownership check happens at execution time, because it has to read the bucket's tags.
 */
export interface DeletePrefixAction {
  readonly type: 'delete-prefix';
  readonly destination: Destination;
}

/**
 * Put a value in the response's `Data` block, where a template can `Fn::GetAtt` it.
 *
 * Covers `DestinationBucketArn` (pure dependency plumbing, echoed straight back) and
 * `SourceObjectKeys`.
 */
export interface SetResponseValueAction {
  readonly type: 'set-response-value';
  readonly key: string;
  readonly value: unknown;
}

/**
 * Allocate a fresh physical resource id.
 *
 * Only a `Create` does this. `Update` and `Delete` relay the incoming id, which is what
 * the entrypoint does when the handler reports none.
 */
export interface AllocatePhysicalIdAction {
  readonly type: 'allocate-physical-id';
}

/** Create a CloudFront invalidation, optionally waiting for it to complete. */
export interface InvalidateCloudFrontAction {
  readonly type: 'invalidate-cloudfront';
  readonly distributionId: string;
  readonly paths: string[];
  readonly wait: boolean;
  /** Seeds a deterministic caller reference, so a retried request does not invalidate twice. */
  readonly requestId: string;
}

export type DeploymentAction =
  | AllocatePhysicalIdAction
  | CopySourcesAction
  | DeletePrefixAction
  | SetResponseValueAction
  | InvalidateCloudFrontAction;

/**
 * Work out what a request implies, in execution order.
 *
 * Throws on a request that cannot be carried out, before anything has been performed.
 */
export function parseRequest(event: AWSLambda.CloudFormationCustomResourceEvent): DeploymentAction[] {
  // Checked first so a malformed request cannot mutate the destination. The entrypoint
  // only catches a missing id on Delete, not on Update.
  if (event.RequestType !== 'Create' && !(event as any).PhysicalResourceId) {
    throw new Error(
      `invalid request: request type is '${event.RequestType}' but 'PhysicalResourceId' is not defined`,
    );
  }

  const props = event.ResourceProperties;
  const destination = parseDestination(props);
  const sourceObjectKeys = requiredList(props, 'SourceObjectKeys');
  const retainOnDelete = parseBoolean(props.RetainOnDelete, true);
  const outputObjectKeys = parseBoolean(props.OutputObjectKeys, true);
  const outputObjectVersionIds = parseBoolean(props.OutputObjectVersionIds, false);

  const actions: DeploymentAction[] = [];

  actions.push(
    { type: 'set-response-value', key: 'DestinationBucketArn', value: props.DestinationBucketArn },
    { type: 'set-response-value', key: 'SourceObjectKeys', value: outputObjectKeys ? sourceObjectKeys : [] },
  );

  if (isCreateEvent(event)) {
    actions.push({ type: 'allocate-physical-id' });
  }

  if (isCreateEvent(event) || isUpdateEvent(event)) {
    // If the destination has changed, delete the old prefix first. If the destination hasn't changed,
    // then pruning will take care of removing old files.
    if (isUpdateEvent(event) && !retainOnDelete) {
      const old = parseDestination(event.OldResourceProperties);
      if (!isEqual(old, destination)) { actions.push({ type: 'delete-prefix', destination: old }); }
    }

    actions.push(parseCopySources(props, destination, sourceObjectKeys, outputObjectVersionIds));
  }

  if (isDeleteEvent(event)) {
    if (!retainOnDelete) { actions.push({ type: 'delete-prefix', destination }); }
    if (outputObjectVersionIds) {
      // Always present when requested, even on Delete. Probably `Fn::GetAtt` will never ever
      // read this, but it's what the old resource did.
      actions.push({ type: 'set-response-value', key: 'SourceObjectVersionIds', value: [] });
    }
  }

  const distributionId = optionalString(props, 'DistributionId');
  if (distributionId && !isDeleteEvent(event)) {
    // Invalidate a given CloudFront Distribution. For optimization's sake,
    // not a Delete. We will assume that the Delete is also going to get rid of the CF distribution itself,
    // so what would be the point of invalidating it?
    actions.push({
      type: 'invalidate-cloudfront',
      distributionId,
      paths: optionalStringList(props, 'DistributionPaths', [`/${destination.keyPrefix}*`]),
      wait: parseBoolean(props.WaitForDistributionInvalidation, true),
      requestId: event.RequestId,
    });
  }

  return actions;
}

/** Build the deployment action, validating everything it needs. */
function parseCopySources(
  props: Record<string, any>,
  destination: Destination,
  sourceObjectKeys: string[],
  outputObjectVersionIds: boolean,
): CopySourcesAction {
  const bucketNames = requiredList(props, 'SourceBucketNames');
  if (bucketNames.length !== sourceObjectKeys.length) {
    // Rejecting beats zipping the lists pairwise, which would silently truncate to the
    // shorter one and deploy part of the request.
    throw new Error(
      `'SourceBucketNames' has ${bucketNames.length} entries but 'SourceObjectKeys' has ${sourceObjectKeys.length}; they must be the same length`,
    );
  }

  const markers = perSource(props, 'SourceMarkers', bucketNames.length);
  const markersConfig = perSource(props, 'SourceMarkersConfig', bucketNames.length);
  const extract = parseBoolean(props.Extract, true);

  if (outputObjectVersionIds && extract) {
    // With extraction on there is no 1:1 mapping from a source to a deployed object, so
    // every id would be meaningless. Rejecting beats returning empty strings, which a
    // caller cannot tell apart from an unversioned bucket.
    throw new Error(
      "'OutputObjectVersionIds' requires 'Extract' to be false: with extraction on, a source archive does not map to a single deployed object",
    );
  }

  return {
    type: 'copy-sources',
    sources: bucketNames.map((bucketName, i) => ({
      bucketName,
      objectKey: sourceObjectKeys[i],
      markers: markers?.[i] ?? {},
      markersConfig: markersConfig?.[i],
    })),
    extract,
    destination,
    prune: parseBoolean(props.Prune, true),
    filters: compileFilters(
      optionalStringList(props, 'Exclude'),
      optionalStringList(props, 'Include'),
    ),
    putObjectSettings: parseMetadataFields(
      optionalStringMap(props, 'UserMetadata'),
      optionalStringMap(props, 'SystemMetadata'),
    ),
    ...(outputObjectVersionIds ? { reportVersionIdsAs: 'SourceObjectVersionIds' } : {}),
  };
}

function parseDestination(props: Record<string, any>): Destination {
  const raw = props.DestinationBucketKeyPrefix;
  return {
    bucketName: requiredString(props, 'DestinationBucketName'),
    keyPrefix: normalizePrefix(raw),
    rawKeyPrefix: raw === undefined || raw === null ? '' : String(raw),
  };
}

/** Normalize a destination prefix to either `''` or something ending in `/`. */
export function normalizePrefix(raw: unknown): string {
  if (raw === undefined || raw === null) { return ''; }
  const prefix = String(raw);
  if (prefix === '' || prefix === '/') { return ''; }
  return prefix.endsWith('/') ? prefix : `${prefix}/`;
}

/**
 * Parse a CloudFormation-delivered boolean.
 *
 * Accepts real booleans (a direct caller may send them) and the strings `"true"`/`"false"`
 * in any casing. Anything unrecognized takes the default, so a typo cannot select a
 * destructive branch.
 */
export function parseBoolean(value: unknown, defaultValue: boolean): boolean {
  if (value === undefined || value === null || value === '') { return defaultValue; }
  if (typeof value === 'boolean') { return value; }

  switch (String(value).toLowerCase()) {
    case 'true': return true;
    case 'false': return false;
    default: return defaultValue;
  }
}

/** A per-source list, checked to cover every source. */
function perSource(props: Record<string, any>, name: string, sourceCount: number): any[] | undefined {
  const value = optionalList(props, name);
  if (value && value.length !== sourceCount) {
    throw new Error(
      `'${name}' has ${value.length} entries but there are ${sourceCount} sources; they must be the same length`,
    );
  }
  return value;
}

function requiredString(props: Record<string, any>, name: string): string {
  const value = props[name];
  if (value === undefined || value === null || value === '') {
    throw new Error(`missing request resource property '${name}'`);
  }
  return String(value);
}

function requiredList(props: Record<string, any>, name: string): string[] {
  const value = props[name];
  if (value === undefined || value === null) {
    throw new Error(`missing request resource property '${name}'`);
  }
  if (!Array.isArray(value)) {
    throw new Error(`request resource property '${name}' must be a list, got ${JSON.stringify(value)}`);
  }
  return value.map(String);
}

/** An optional string property. An empty string is treated as absent. */
function optionalString(props: Record<string, any>, name: string): string | undefined {
  if (!(name in props)) { return undefined; }
  const value = props[name];
  if (value === undefined || value === null || value === '') { return undefined; }
  return String(value);
}

function optionalList(props: Record<string, any>, name: string): any[] | undefined {
  const value = props[name];
  if (value === undefined || value === null) { return undefined; }
  if (!Array.isArray(value)) {
    throw new Error(`request resource property '${name}' must be a list, got ${JSON.stringify(value)}`);
  }
  return value;
}

function optionalStringList(props: Record<string, any>, name: string, defaultValue: string[] = []): string[] {
  return optionalList(props, name)?.map(String) ?? defaultValue;
}

function optionalStringMap(props: Record<string, any>, name: string): Record<string, string> {
  const value = props[name];
  if (value === undefined || value === null) { return {}; }
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`request resource property '${name}' must be a map, got ${JSON.stringify(value)}`);
  }
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, String(v)]));
}

function isEqual(a: Destination, b: Destination) {
  return a.bucketName === b.bucketName && a.keyPrefix === b.keyPrefix;
}

function isCreateEvent<A>(x: AWSLambda.CloudFormationCustomResourceEvent<A>): x is AWSLambda.CloudFormationCustomResourceCreateEvent<A> {
  return x.RequestType === 'Create';
}

function isUpdateEvent<A>(x: AWSLambda.CloudFormationCustomResourceEvent<A>): x is AWSLambda.CloudFormationCustomResourceUpdateEvent<A> {
  return x.RequestType === 'Update';
}

function isDeleteEvent<A>(x: AWSLambda.CloudFormationCustomResourceEvent<A>): x is AWSLambda.CloudFormationCustomResourceDeleteEvent<A> {
  return x.RequestType === 'Delete';
}

