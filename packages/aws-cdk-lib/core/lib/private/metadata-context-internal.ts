import { UnscopedValidationError } from '../errors';
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
  if (context.failureModes !== undefined && context.failureModes.length > 0) {
    out.failureModes = [...context.failureModes];
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
  for (const listField of ['must', 'gaps', 'deps', 'failureModes']) {
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
  if (Object.values(renderResourceContext(context)).length === 0) {
    throw new UnscopedValidationError(lit`EmptyMetadataContext`, 'MetadataContext requires at least one context field (why, must, defaultMutability, propertyMutability, trust, ops, gaps, deps or failureModes)');
  }
  for (const [field, value] of Object.entries({ why: context.why, ops: context.ops })) {
    if (value !== undefined && value.trim() === '') {
      throw new UnscopedValidationError(lit`EmptyMetadataContextEntry`, `MetadataContext '${field}' must be a non-empty string when provided`);
    }
  }
  for (const [field, entries] of Object.entries({ must: context.must, gaps: context.gaps, deps: context.deps, failureModes: context.failureModes })) {
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
    if (ref.at.trim() === '') {
      throw new UnscopedValidationError(lit`EmptyMetadataContextRef`, 'MetadataContext refs require a non-empty \'at\' URI');
    }
  }
}
