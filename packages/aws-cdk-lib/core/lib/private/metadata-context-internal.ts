import type { IConstruct } from 'constructs';
import { UnscopedValidationError, ValidationError } from '../errors';
import type { ResourceContextProps, TemplateContextProps, ContextRef } from '../metadata-context';
import { lit } from './literal-string';

/**
 * The construct-node metadata type used to stage resource context entries
 * until the rendering aspect writes them onto CloudFormation resources.
 */
export const RESOURCE_CONTEXT_METADATA_TYPE = 'aws:cdk:metadata-context';

/**
 * Render explicitly authored props into the advisory schema.
 *
 * The public TypeScript/jsii prop names (`defaultMutability`,
 * `propertyMutability`) are rendered under the canonical wire keys
 * (`mutable`, `mutability`) so the emitted schema vocabulary is unchanged.
 */
export function renderResourceContext(context: ResourceContextProps): Record<string, any> {
  const out: Record<string, any> = {};
  if (context.why !== undefined) {
    out.why = context.why;
  }
  if (context.must !== undefined && context.must.length > 0) {
    out.must = [...context.must];
  }
  if (context.defaultMutability !== undefined) {
    out.mutable = context.defaultMutability;
  }
  if (context.propertyMutability !== undefined && Object.keys(context.propertyMutability).length > 0) {
    out.mutability = { ...context.propertyMutability };
  }
  if (context.trust !== undefined) {
    const trust: Record<string, any> = {};
    if (context.trust.source !== undefined) {
      trust.src = context.trust.source;
    }
    if (context.trust.confidence !== undefined) {
      trust.conf = context.trust.confidence;
    }
    if (context.trust.citation !== undefined) {
      trust.cite = context.trust.citation;
    }
    if (context.trust.note !== undefined) {
      trust.note = context.trust.note;
    }
    out.trust = trust;
  }
  if (context.ops !== undefined) {
    out.ops = context.ops;
  }
  if (context.gaps !== undefined && context.gaps.length > 0) {
    out.gaps = [...context.gaps];
  }
  if (context.deps !== undefined && context.deps.length > 0) {
    out.deps = [...context.deps];
  }
  return out;
}

/**
 * Merge two rendered context blocks; fields in `overriding` win over
 * `base` for scalars, while list fields accumulate (base first) and the
 * `mutability` map merges per key.
 */
export function mergeResourceContext(base: Record<string, any> | undefined, overriding: Record<string, any>): Record<string, any> {
  if (base === undefined) {
    return { ...overriding };
  }
  const out: Record<string, any> = { ...base };
  for (const scalar of ['why', 'mutable', 'trust', 'ops']) {
    if (overriding[scalar] !== undefined) {
      out[scalar] = overriding[scalar];
    }
  }
  for (const listField of ['must', 'gaps', 'deps']) {
    if (overriding[listField] !== undefined) {
      out[listField] = dedupe([...(base[listField] ?? []), ...overriding[listField]]);
    }
  }
  if (overriding.mutability !== undefined) {
    out.mutability = { ...(base.mutability ?? {}), ...overriding.mutability };
  }
  return out;
}

export function renderRef(ref: ContextRef): any {
  if (ref.has === undefined && ref.scope === undefined) {
    // Bare-string form keeps templates terse.
    return ref.at;
  }
  const out: Record<string, string> = { at: ref.at };
  if (ref.has !== undefined) {
    out.has = ref.has;
  }
  if (ref.scope !== undefined) {
    out.scope = ref.scope;
  }
  return out;
}

export function dedupe(entries: string[]): string[] {
  return [...new Set(entries)];
}

export function validateResourceContext(context: ResourceContextProps) {
  const rendered = renderResourceContext(context);
  const contentFields = Object.keys(rendered).filter(field => field !== 'trust');
  if (contentFields.length === 0) {
    throw new UnscopedValidationError(
      lit`MissingMetadataContextContent`,
      'MetadataContext requires at least one content field (why, must, defaultMutability, propertyMutability, ops, gaps or deps); trust cannot be used alone',
    );
  }
  for (const [field, value] of Object.entries({ why: context.why, ops: context.ops })) {
    if (value !== undefined && value.trim() === '') {
      throw new UnscopedValidationError(lit`EmptyMetadataContextEntry`, `MetadataContext '${field}' must be a non-empty string when provided`);
    }
  }
  for (const [field, entries] of Object.entries({ must: context.must, gaps: context.gaps, deps: context.deps })) {
    for (const entry of entries ?? []) {
      if (entry.trim() === '') {
        throw new UnscopedValidationError(lit`EmptyMetadataContextEntry`, `MetadataContext '${field}' entries must be non-empty strings`);
      }
    }
  }
  validateTrust(context.trust);
  validatePropertyMutability(context);
}

function validateTrust(trust: ResourceContextProps['trust']) {
  if (trust === undefined) {
    return;
  }
  if (trust.source === undefined) {
    throw new UnscopedValidationError(lit`MissingMetadataContextTrustSource`, 'MetadataContext trust requires a \'source\' when trust is provided');
  }
  if (trust.confidence === undefined) {
    throw new UnscopedValidationError(lit`MissingMetadataContextTrustConfidence`, 'MetadataContext trust requires a \'confidence\' when trust is provided');
  }
  for (const [field, value] of Object.entries({ citation: trust.citation, note: trust.note })) {
    if (value !== undefined && value.trim() === '') {
      throw new UnscopedValidationError(lit`EmptyMetadataContextTrustEntry`, `MetadataContext trust '${field}' must be a non-empty string when provided`);
    }
  }
}

function validatePropertyMutability(context: ResourceContextProps) {
  if (context.defaultMutability === undefined || context.propertyMutability === undefined) {
    return;
  }
  for (const [property, mutability] of Object.entries(context.propertyMutability)) {
    if (mutability === context.defaultMutability) {
      throw new UnscopedValidationError(
        lit`RedundantMetadataContextPropertyMutability`,
        `MetadataContext propertyMutability entry '${property}' must not repeat defaultMutability ${JSON.stringify(context.defaultMutability)}; the map records deviations only`,
      );
    }
  }
}

const CONSTRAINED_MUTABILITY_VALUES = new Set<string>([
  'must-never-change',
  'change-with-constraints',
]);

export function validateRenderedResourceContext(context: Record<string, any>, scope: IConstruct) {
  if (typeof context.why !== 'string' || context.why.trim().length === 0) {
    throw new ValidationError(
      lit`MetadataContextWhyRequired`,
      'Resource Context requires a non-empty why field; omit Context entirely for a trivial resource and use gaps when some reasoning is unknown',
      scope,
    );
  }

  const constrainedFields: string[] = [];
  if (CONSTRAINED_MUTABILITY_VALUES.has(context.mutable)) {
    constrainedFields.push(`mutable=${JSON.stringify(context.mutable)}`);
  }
  for (const [property, mutability] of Object.entries(context.mutability ?? {})) {
    if (CONSTRAINED_MUTABILITY_VALUES.has(mutability as string)) {
      constrainedFields.push(`mutability.${property}=${JSON.stringify(mutability)}`);
    }
  }

  const hasMust = Array.isArray(context.must)
    && context.must.some((entry: unknown) => typeof entry === 'string' && entry.trim().length > 0);
  if (constrainedFields.length > 0 && !hasMust) {
    throw new ValidationError(
      lit`ConstrainedMetadataContextRequiresMust`,
      `Resource Context ${constrainedFields.join(', ')} requires at least one non-empty must entry`,
      scope,
    );
  }
}

export function validateTemplateContext(context: TemplateContextProps) {
  const empty = context.arch === undefined
    && (context.must === undefined || context.must.length === 0)
    && (context.refs === undefined || context.refs.length === 0)
    && context.owner === undefined;
  if (empty) {
    throw new UnscopedValidationError(lit`EmptyMetadataContext`, 'TemplateMetadataContext.add() requires at least one context field (arch, must, refs or owner)');
  }
  for (const entry of context.must ?? []) {
    if (entry.trim() === '') {
      throw new UnscopedValidationError(lit`EmptyMetadataContextEntry`, 'MetadataContext template-level \'must\' entries must be non-empty strings');
    }
  }
  for (const ref of context.refs ?? []) {
    const at = ref.at.trim();
    if (at === '') {
      throw new UnscopedValidationError(lit`EmptyMetadataContextRef`, 'MetadataContext refs require a non-empty \'at\' path');
    }
    const hasUriScheme = /^[a-z][a-z0-9+.-]*:/i.test(at);
    const isAbsolute = at.startsWith('/') || at.startsWith('\\') || at === '~' || at.startsWith('~/') || at.startsWith('~\\');
    const escapesRepository = at.split(/[\\/]+/).includes('..');
    if (hasUriScheme || isAbsolute || escapesRepository) {
      throw new UnscopedValidationError(
        lit`UnsafeMetadataContextRef`,
        `MetadataContext ref ${JSON.stringify(ref.at)} must be a relative path within the same repository; network URLs, URI schemes, absolute paths and parent-directory traversal are not allowed`,
      );
    }
  }
}
