/**
 * Request parsing and validation (contract §2).
 *
 * CloudFormation stringifies custom-resource properties, so booleans arrive as the strings
 * `"true"`/`"false"`. This module is the single place that knows that, so the rest of the
 * handler works with real types.
 *
 * Boolean parsing is uniform and case-insensitive here. The original implementation
 * compared some properties with `== "true"` exactly and others after lowercasing, which
 * made `RetainOnDelete: "True"` select *deletion* (B7) and made the string `"false"` for
 * `WaitForDistributionInvalidation` mean "wait" (B12). Unrecognized values now fall back to
 * each property's documented default rather than to whichever branch the comparison
 * happened to pick.
 */
import type { MarkersConfig } from './markers';

/** One source object to deploy. */
export interface Source {
  readonly bucketName: string;
  readonly objectKey: string;
  readonly markers: Record<string, unknown>;
  readonly markersConfig?: MarkersConfig;
}

/** A fully parsed, validated request. */
export interface DeploymentRequest {
  readonly sources: Source[];
  readonly destinationBucketName: string;
  readonly destinationBucketKeyPrefix: string;
  /**
   * The prefix exactly as the caller sent it.
   *
   * Kept alongside the normalized form only for the ownership guard: the tag the
   * `BucketDeployment` construct writes embeds the caller's spelling, so a guard that
   * only looked for the normalized one would fail to see a tag written for an unslashed
   * prefix and would delete content that is in fact owned.
   */
  readonly rawKeyPrefix: string;
  /** Echoed back in the response; otherwise unused. */
  readonly destinationBucketArn?: string;
  readonly extract: boolean;
  readonly prune: boolean;
  readonly exclude: string[];
  readonly include: string[];
  readonly retainOnDelete: boolean;
  readonly distributionId?: string;
  readonly distributionPaths: string[];
  readonly waitForDistributionInvalidation: boolean;
  readonly userMetadata: Record<string, string>;
  readonly systemMetadata: Record<string, string>;
  readonly outputObjectKeys: boolean;
  readonly outputObjectVersionIds: boolean;
  /** Raw source keys, for the response. */
  readonly sourceObjectKeys: string[];
}

/** Parse `ResourceProperties`. Throws with a caller-actionable message on bad input. */
export function parseRequest(props: Record<string, any>): DeploymentRequest {
  const bucketNames = requiredList(props, 'SourceBucketNames');
  const objectKeys = requiredList(props, 'SourceObjectKeys');
  const destinationBucketName = requiredString(props, 'DestinationBucketName');

  if (bucketNames.length !== objectKeys.length) {
    // The original zipped the two lists pairwise, silently truncating to the shorter one
    // and deploying part of the request (B11).
    throw new Error(
      `'SourceBucketNames' has ${bucketNames.length} entries but 'SourceObjectKeys' has ${objectKeys.length}; they must be the same length`,
    );
  }

  const markers = optionalList(props, 'SourceMarkers');
  if (markers && markers.length !== bucketNames.length) {
    throw new Error(
      `'SourceMarkers' has ${markers.length} entries but there are ${bucketNames.length} sources; they must be the same length`,
    );
  }

  const markersConfig = optionalList(props, 'SourceMarkersConfig');
  if (markersConfig && markersConfig.length !== bucketNames.length) {
    throw new Error(
      `'SourceMarkersConfig' has ${markersConfig.length} entries but there are ${bucketNames.length} sources; they must be the same length`,
    );
  }

  const sources: Source[] = bucketNames.map((bucketName, i) => ({
    bucketName,
    objectKey: objectKeys[i],
    markers: markers?.[i] ?? {},
    markersConfig: markersConfig?.[i],
  }));

  const prefix = normalizePrefix(props.DestinationBucketKeyPrefix);

  return {
    sources,
    sourceObjectKeys: objectKeys,
    destinationBucketName,
    destinationBucketKeyPrefix: prefix,
    rawKeyPrefix: props.DestinationBucketKeyPrefix === undefined ? '' : String(props.DestinationBucketKeyPrefix),
    destinationBucketArn: props.DestinationBucketArn,
    extract: parseBoolean(props.Extract, true),
    prune: parseBoolean(props.Prune, true),
    exclude: optionalStringList(props, 'Exclude'),
    include: optionalStringList(props, 'Include'),
    retainOnDelete: parseBoolean(props.RetainOnDelete, true),
    distributionId: optionalString(props, 'DistributionId'),
    distributionPaths: optionalStringList(props, 'DistributionPaths', defaultDistributionPaths(prefix)),
    waitForDistributionInvalidation: parseBoolean(props.WaitForDistributionInvalidation, true),
    userMetadata: optionalStringMap(props, 'UserMetadata'),
    systemMetadata: optionalStringMap(props, 'SystemMetadata'),
    outputObjectKeys: parseBoolean(props.OutputObjectKeys, true),
    outputObjectVersionIds: parseBoolean(props.OutputObjectVersionIds, false),
  };
}

/**
 * Normalize the destination prefix to either `''` or something ending in `/`.
 *
 * Doing this once, here, is what keeps the deployment and the destructive paths in
 * agreement. The original passed the prefix through verbatim, so `app` deleted `apple/`
 * and `appendix.txt` on the `rm` path while pruning the same deployment stayed correctly
 * inside `app/` (B2).
 */
export function normalizePrefix(raw: unknown): string {
  if (raw === undefined || raw === null) { return ''; }
  const prefix = String(raw);
  if (prefix === '' || prefix === '/') { return ''; }
  return prefix.endsWith('/') ? prefix : `${prefix}/`;
}

/** The invalidation paths implied by a destination prefix. */
export function defaultDistributionPaths(normalizedPrefix: string): string[] {
  return [`/${normalizedPrefix}*`];
}

/**
 * Parse a CloudFormation-delivered boolean.
 *
 * Accepts real booleans (a direct caller may send them) and the strings `"true"`/`"false"`
 * in any casing. Anything else takes the default.
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

function requiredString(props: Record<string, any>, name: string): string {
  const value = props[name];
  if (value === undefined || value === null || value === '') {
    throw new Error(`missing request resource property '${name}'`);
  }
  return String(value);
}

/** An optional string property. An empty string is treated as absent. */
function optionalString(props: Record<string, any>, name: string): string | undefined {
  if (!(name in props)) { return undefined; }
  const value = props[name];
  if (value === undefined || value === null || value === '') { return undefined; }
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
